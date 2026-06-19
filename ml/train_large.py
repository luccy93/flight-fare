import os
import numpy as np
import pandas as pd
import joblib
import glob
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from lightgbm import LGBMRegressor

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)


def find_data_file():
    patterns = [
        os.path.join(PROJECT_ROOT, 'Data_Train.xlsx'),
        os.path.join(DATA_DIR, 'synthetic_fare_data.csv'),
        os.path.join(DATA_DIR, 'bts_combined.parquet'),
        os.path.join(DATA_DIR, '*.csv'),
        os.path.join(DATA_DIR, '*.parquet'),
    ]
    for p in patterns:
        matches = glob.glob(p)
        if matches:
            return matches[0]
    return None


def load_large_data(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    if ext == '.xlsx':
        return pd.read_excel(filepath)
    elif ext == '.csv':
        return pd.read_csv(filepath, low_memory=False)
    elif ext == '.parquet':
        return pd.read_parquet(filepath)
    else:
        raise ValueError(f"Unknown format: {ext}")


def normalize_columns(df):
    rename = {}
    col_map = {
        'FlightDate': 'Date_of_Journey', 'Reporting_Airline': 'Airline',
        'Origin': 'Source', 'Dest': 'Destination',
        'CRSDepTime': 'Dep_Time', 'DepTime': 'Dep_Time',
        'CRSArrTime': 'Arrival_Time', 'ArrTime': 'Arrival_Time',
    }
    for old, new in col_map.items():
        if old in df.columns and new not in df.columns:
            rename[old] = new
    df = df.rename(columns=rename)
    if 'Price' not in df.columns and 'Distance' in df.columns:
        airline_mult = df['Airline'].astype('category').cat.codes * 0.1 + 0.9
        df['Price'] = (2000 * airline_mult + df['Distance'] * 0.5 + np.random.normal(0, 300, len(df))).clip(1000, 80000).astype(int)
    for col in ['Airline', 'Source', 'Destination', 'Date_of_Journey', 'Dep_Time', 'Arrival_Time', 'Duration', 'Total_Stops']:
        if col not in df.columns:
            if col == 'Total_Stops':
                df[col] = 'non-stop'
            elif col == 'Duration':
                df['Duration'] = '2h 0m'
            elif col == 'Dep_Time':
                df['Dep_Time'] = '10:00'
            elif col == 'Arrival_Time':
                df['Arrival_Time'] = '12:00'
            elif col == 'Date_of_Journey':
                df['Date_of_Journey'] = '01/01/2024'
            else:
                df[col] = 'Unknown'
    return df


def clean_data(df):
    df = df.dropna(subset=['Price']).copy()
    df = df.drop_duplicates()
    df = df[df['Source'] != df['Destination']]
    return df


def remove_outliers(df, column='Price'):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    return df[(df[column] >= Q1 - 1.5 * IQR) & (df[column] <= Q3 + 1.5 * IQR)]


def parse_duration_series(duration_series):
    dur = duration_series.fillna('2h 0m').astype(str)
    for i in range(len(dur)):
        d = dur.iloc[i].strip()
        if len(d.split()) != 2:
            if 'h' in d:
                dur.iloc[i] = d + ' 0m'
            elif 'm' in d:
                dur.iloc[i] = '0h ' + d
            else:
                dur.iloc[i] = '2h 0m'
    hours = dur.str.extract(r'(\d+)h', expand=False).fillna(0).astype(int)
    mins = dur.str.extract(r'(\d+)m', expand=False).fillna(0).astype(int)
    return hours, mins


def feature_engineer(df, sample_frac=1.0):
    if sample_frac < 1.0 and len(df) > 100000:
        df = df.sample(frac=sample_frac, random_state=42)
    data = df.copy()
    data['Date_of_Journey'] = pd.to_datetime(data['Date_of_Journey'], dayfirst=True, errors='coerce').fillna(pd.Timestamp('2024-01-01'))
    data['Journey_Day'] = data['Date_of_Journey'].dt.day
    data['Journey_Month'] = data['Date_of_Journey'].dt.month
    data['Journey_Weekday'] = data['Date_of_Journey'].dt.weekday
    data['Dep_Hour'] = pd.to_datetime(data['Dep_Time'], format='%H:%M', errors='coerce').dt.hour.fillna(0).astype(int)
    data['Dep_Min'] = pd.to_datetime(data['Dep_Time'], format='%H:%M', errors='coerce').dt.minute.fillna(0).astype(int)
    data['Arrival_Hour'] = pd.to_datetime(data['Arrival_Time'], format='%H:%M', errors='coerce').dt.hour.fillna(0).astype(int)
    data['Arrival_Min'] = pd.to_datetime(data['Arrival_Time'], format='%H:%M', errors='coerce').dt.minute.fillna(0).astype(int)
    if 'Duration' in data.columns:
        dur_h, dur_m = parse_duration_series(data['Duration'])
        data['Duration_Hours'] = dur_h
        data['Duration_Mins'] = dur_m
    else:
        data['Duration_Hours'] = ((data['Arrival_Hour'] - data['Dep_Hour']) % 24)
        data['Duration_Mins'] = ((data['Arrival_Min'] - data['Dep_Min']) % 60)
    stops_map = {'non-stop': 0, '1 stop': 1, '2 stops': 2, '3 stops': 3, '4 stops': 4}
    data['Total_Stops'] = data['Total_Stops'].astype(str).str.lower().map(stops_map).fillna(0).astype(int)
    data = pd.get_dummies(data, columns=['Airline', 'Source', 'Destination'], drop_first=True, dummy_na=False)
    drop_cols = ['Route', 'Date_of_Journey', 'Dep_Time', 'Arrival_Time', 'Duration', 'Additional_Info', 'FlightDate', 'Year', 'Month', 'Distance']
    data = data.drop(columns=[c for c in drop_cols if c in data.columns], errors='ignore')
    return data


def train_models(X_train, y_train, X_test, y_test):
    models = {
        'LightGBM': LGBMRegressor(n_estimators=300, learning_rate=0.1, max_depth=8, random_state=42, n_jobs=-1, verbose=-1),
        'RandomForest': RandomForestRegressor(n_estimators=200, max_depth=15, random_state=42, n_jobs=-1),
        'XGBoost': XGBRegressor(n_estimators=300, learning_rate=0.1, max_depth=8, random_state=42, n_jobs=-1),
        'CatBoost': CatBoostRegressor(iterations=300, learning_rate=0.1, depth=6, random_seed=42, verbose=0),
    }
    results = {}
    best_model = None
    best_score = -np.inf
    for name, model in models.items():
        print(f'  Training {name}...')
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        results[name] = {'RMSE': rmse, 'MAE': mae, 'MSE': mse, 'R2': r2}
        print(f'    {name}: R2={r2:.4f}, RMSE={rmse:.2f}, MAE={mae:.2f}')
        if r2 > best_score:
            best_score = r2
            best_model = model
    return results, best_model


def save_artifacts(model, model_name, feature_names):
    model_path = os.path.join(MODELS_DIR, f'{model_name.lower().replace(" ", "_")}.joblib')
    joblib.dump(model, model_path)
    joblib.dump(list(feature_names), os.path.join(MODELS_DIR, 'features.joblib'))
    joblib.dump({'feature_names': list(feature_names), 'model_name': model_name}, os.path.join(MODELS_DIR, 'preprocessor.joblib'))
    return model_path


def run_pipeline(sample_frac=1.0):
    print('[1/6] Finding data source...')
    filepath = find_data_file()
    if not filepath:
        print('  No data found. Generating 100k synthetic rows...')
        from data_collector import generate_synthetic_fare_data
        generate_synthetic_fare_data(100000)
        filepath = find_data_file()
    print(f'  Using: {filepath}')
    print('[2/6] Loading data...')
    df = load_large_data(filepath)
    print(f'  Loaded {len(df)} rows')
    print('[3/6] Normalizing & cleaning...')
    df = normalize_columns(df)
    df = clean_data(df)
    df = remove_outliers(df)
    print(f'  After cleaning: {len(df)} rows')
    print('[4/6] Feature engineering...')
    data = feature_engineer(df, sample_frac=sample_frac)
    print(f'  Feature matrix: {data.shape}')
    if 'Price' not in data.columns:
        raise ValueError("Price column not found after feature engineering")
    y = data['Price']
    X = data.drop(columns=['Price'])
    feature_names = X.columns.tolist()
    print(f'  Total features: {len(feature_names)}')
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f'  Train: {len(X_train)}, Test: {len(X_test)}')
    print('[5/6] Training models...')
    results, best_model = train_models(X_train, y_train, X_test, y_test)
    print('\n========== MODEL COMPARISON ==========')
    print(f'{"Model":15s} | {"RMSE":>10s} | {"MAE":>10s} | {"MSE":>12s} | {"R2":>6s}')
    for name, m in results.items():
        print(f'{name:15s} | {m["RMSE"]:>10.2f} | {m["MAE"]:>10.2f} | {m["MSE"]:>12.2f} | {m["R2"]:.4f}')
    best_name = max(results, key=lambda k: results[k]['R2'])
    print(f'\n[INFO] Best model: {best_name} (R2: {results[best_name]["R2"]:.4f})')
    print('[6/6] Saving artifacts...')
    model_path = save_artifacts(best_model, best_name, feature_names)
    print(f'  Model saved to: {model_path}')
    print('\n[SUCCESS] Pipeline complete! Run `docker-compose up --build` to start the app.')
    return results, best_model


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--sample', type=float, default=1.0, help='Sample fraction for large datasets (e.g. 0.1 for 10%)')
    args = parser.parse_args()
    run_pipeline(sample_frac=args.sample)
