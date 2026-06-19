import os
import re
import numpy as np
import pandas as pd
import joblib

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')

def _load_artifacts():
    model_file = None
    for f in os.listdir(MODELS_DIR):
        if f.endswith('.joblib') and f != 'preprocessor.joblib' and f != 'features.joblib':
            model_file = os.path.join(MODELS_DIR, f)
            break
    if model_file is None:
        raise FileNotFoundError('No model file found in ml/models/')
    model = joblib.load(model_file)
    features_path = os.path.join(MODELS_DIR, 'features.joblib')
    feature_names = joblib.load(features_path)
    return model, feature_names

def _engineer_single(features: dict) -> pd.DataFrame:
    row = {}
    row['Total_Stops'] = {'non-stop': 0, '1 stop': 1, '2 stops': 2, '3 stops': 3, '4 stops': 4}.get(
        features.get('Total_Stops', 'non-stop'), 0)
    date_str = features.get('Date_of_Journey', '01/01/2022')
    dt = pd.to_datetime(date_str, format='%d/%m/%Y', errors='coerce')
    if pd.isna(dt):
        dt = pd.to_datetime(date_str, errors='coerce')
    row['Journey_Day'] = dt.day
    row['Journey_Month'] = dt.month
    row['Journey_Weekday'] = dt.weekday()
    dep = features.get('Dep_Time', '00:00')
    try:
        dep_dt = pd.to_datetime(dep, format='%H:%M', errors='coerce')
    except:
        dep_dt = pd.to_datetime(dep, errors='coerce')
    if pd.isna(dep_dt):
        dep_dt = pd.Timestamp('2022-01-01 00:00:00')
    row['Dep_Hour'] = dep_dt.hour
    row['Dep_Min'] = dep_dt.minute
    arr = features.get('Arrival_Time', '00:00')
    try:
        arr_dt = pd.to_datetime(arr, format='%H:%M', errors='coerce')
    except:
        arr_dt = pd.to_datetime(arr, errors='coerce')
    if pd.isna(arr_dt):
        arr_dt = pd.Timestamp('2022-01-01 00:00:00')
    row['Arrival_Hour'] = arr_dt.hour
    row['Arrival_Min'] = arr_dt.minute
    dur = features.get('Duration', '0h 0m')
    dur = dur.strip()
    if len(dur.split()) != 2:
        if 'h' in dur:
            dur = dur + ' 0m'
        else:
            dur = '0h ' + dur
    row['Duration_Hours'] = int(dur.split('h')[0])
    row['Duration_Mins'] = int(dur.split('m')[0].split()[-1])
    air = features.get('Airline', '')
    src = features.get('Source', '')
    dst = features.get('Destination', '')
    for val in [air]:
        col = f'Airline_{val}'
        row[col] = 1
    for val in [src]:
        col = f'Source_{val}'
        row[col] = 1
    for val in [dst]:
        col = f'Destination_{val}'
        row[col] = 1
    return pd.DataFrame([row])

def predict(features: dict) -> dict:
    model, feature_names = _load_artifacts()
    df = _engineer_single(features)
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0
    df = df[feature_names]
    pred = model.predict(df)[0]
    if hasattr(model, 'estimators_'):
        tree_preds = np.array([tree.predict(df)[0] for tree in model.estimators_])
        confidence = 1.0 / (1.0 + np.std(tree_preds) / (np.abs(pred) + 1))
    elif hasattr(model, 'booster_'):
        confidence = 0.85
    else:
        confidence = 0.85
    confidence = round(float(np.clip(confidence, 0, 1)), 4)
    pred = float(pred)
    price_percentiles = _load_price_percentiles()
    if price_percentiles:
        if pred <= price_percentiles.get('low', pred * 0.8):
            category = 'Low'
        elif pred <= price_percentiles.get('high', pred * 1.2):
            category = 'Medium'
        else:
            category = 'High'
    else:
        category = 'Medium'
    cheapest = 'Book 3-4 weeks in advance for best prices'
    return {
        'predicted_price': round(pred, 2),
        'confidence_score': confidence,
        'price_category': category,
        'recommendation': f'The predicted fare is {category.lower()}. {cheapest}',
        'cheapest_booking_window': '3-4 weeks before departure'
    }

def _load_price_percentiles():
    try:
        import os
        import pandas as pd
        PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        train_path = os.path.join(PROJECT_ROOT, 'Data_Train.xlsx')
        df = pd.read_excel(train_path)
        p33 = df['Price'].quantile(0.33)
        p66 = df['Price'].quantile(0.66)
        return {'low': p33, 'high': p66}
    except:
        return None

if __name__ == '__main__':
    sample = {
        'Airline': 'IndiGo',
        'Date_of_Journey': '24/03/2019',
        'Source': 'Banglore',
        'Destination': 'New Delhi',
        'Dep_Time': '22:20',
        'Arrival_Time': '01:10',
        'Duration': '2h 50m',
        'Total_Stops': 'non-stop'
    }
    result = predict(sample)
    for k, v in result.items():
        print(f'{k}: {v}')
