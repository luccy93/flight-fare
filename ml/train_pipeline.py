import os
import re
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from lightgbm import LGBMRegressor
import warnings
warnings.filterwarnings('ignore')

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')

def load_data():
    train_path = os.path.join(PROJECT_ROOT, 'Data_Train.xlsx')
    df = pd.read_excel(train_path)
    return df

def clean_data(df):
    df = df.dropna().copy()
    df = df.drop_duplicates()
    return df

def remove_outliers(df, column='Price'):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    return df[(df[column] >= lower) & (df[column] <= upper)]

def feature_engineer(df):
    data = df.copy()
    data['Journey_Day'] = pd.to_datetime(data['Date_of_Journey'], format='%d/%m/%Y').dt.day
    data['Journey_Month'] = pd.to_datetime(data['Date_of_Journey'], format='%d/%m/%Y').dt.month
    data['Journey_Weekday'] = pd.to_datetime(data['Date_of_Journey'], format='%d/%m/%Y').dt.weekday
    data['Dep_Hour'] = pd.to_datetime(data['Dep_Time']).dt.hour
    data['Dep_Min'] = pd.to_datetime(data['Dep_Time']).dt.minute
    data['Arrival_Hour'] = pd.to_datetime(data['Arrival_Time']).dt.hour
    data['Arrival_Min'] = pd.to_datetime(data['Arrival_Time']).dt.minute
    duration = list(data['Duration'])
    for i in range(len(duration)):
        if len(duration[i].split()) != 2:
            if 'h' in duration[i]:
                duration[i] = duration[i].strip() + ' 0m'
            else:
                duration[i] = '0h ' + duration[i]
    data['Duration_Hours'] = [int(d.split('h')[0]) for d in duration]
    data['Duration_Mins'] = [int(d.split('m')[0].split()[-1]) for d in duration]
    stops_map = {'non-stop': 0, '1 stop': 1, '2 stops': 2, '3 stops': 3, '4 stops': 4}
    data['Total_Stops'] = data['Total_Stops'].map(stops_map)
    data = pd.get_dummies(data, columns=['Airline', 'Source', 'Destination'], drop_first=True)
    drop_cols = ['Route', 'Date_of_Journey', 'Dep_Time', 'Arrival_Time', 'Duration', 'Additional_Info']
    data = data.drop(columns=[c for c in drop_cols if c in data.columns], errors='ignore')
    return data

def align_columns(X_train, X_test):
    missing_cols = set(X_train.columns) - set(X_test.columns)
    for c in missing_cols:
        X_test[c] = 0
    extra_cols = set(X_test.columns) - set(X_train.columns)
    X_test = X_test.drop(columns=extra_cols, errors='ignore')
    return X_test[X_train.columns]

def train_models(X_train, y_train, X_test, y_test):
    models = {
        'RandomForest': RandomForestRegressor(n_estimators=700, max_depth=20, min_samples_split=15,
                                                min_samples_leaf=1, max_features='auto', random_state=42, n_jobs=-1),
        'XGBoost': XGBRegressor(n_estimators=500, learning_rate=0.1, max_depth=10, random_state=42, n_jobs=-1),
        'CatBoost': CatBoostRegressor(iterations=500, learning_rate=0.1, depth=8, random_seed=42, verbose=0),
        'LightGBM': LGBMRegressor(n_estimators=500, learning_rate=0.1, max_depth=10, random_state=42, n_jobs=-1, verbose=-1)
    }
    results = {}
    best_model = None
    best_score = -np.inf
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        results[name] = {'RMSE': rmse, 'MAE': mae, 'MSE': mse, 'R2': r2}
        if r2 > best_score:
            best_score = r2
            best_model = model
    return results, best_model

def save_artifacts(model, model_name, feature_names):
    os.makedirs(MODELS_DIR, exist_ok=True)
    model_path = os.path.join(MODELS_DIR, f'{model_name.lower().replace(" ", "_")}.joblib')
    joblib.dump(model, model_path)
    features_path = os.path.join(MODELS_DIR, 'features.joblib')
    joblib.dump(list(feature_names), features_path)
    preprocessor_path = os.path.join(MODELS_DIR, 'preprocessor.joblib')
    joblib.dump({'feature_names': list(feature_names), 'model_name': model_name}, preprocessor_path)
    return model_path

def run_pipeline():
    print('[INFO] Loading data...')
    df = load_data()
    print(f'[INFO] Loaded {len(df)} rows')
    print('[INFO] Cleaning data...')
    df = clean_data(df)
    print(f'[INFO] After cleaning: {len(df)} rows')
    print('[INFO] Removing outliers...')
    df = remove_outliers(df)
    print(f'[INFO] After outlier removal: {len(df)} rows')
    print('[INFO] Feature engineering...')
    data = feature_engineer(df)
    print(f'[INFO] Feature shape: {data.shape}')
    y = data['Price']
    X = data.drop(columns=['Price'])
    feature_names = X.columns.tolist()
    print(f'[INFO] Features ({len(feature_names)}): {feature_names}')
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f'[INFO] Train: {len(X_train)}, Test: {len(X_test)}')
    print('[INFO] Training models...')
    results, best_model = train_models(X_train, y_train, X_test, y_test)
    print('\n========== MODEL COMPARISON ==========')
    for name, metrics in results.items():
        print(f'{name:15s} | RMSE: {metrics["RMSE"]:>10.2f} | MAE: {metrics["MAE"]:>10.2f} | MSE: {metrics["MSE"]:>12.2f} | R2: {metrics["R2"]:.4f}')
    best_name = max(results, key=lambda k: results[k]['R2'])
    print(f'\n[INFO] Best model: {best_name} (R2: {results[best_name]["R2"]:.4f})')
    model_path = save_artifacts(best_model, best_name, feature_names)
    print(f'[INFO] Model saved to: {model_path}')
    print('[INFO] Pipeline complete.')
    return results, best_model

if __name__ == '__main__':
    run_pipeline()
