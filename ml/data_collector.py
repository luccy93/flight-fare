import os
import pandas as pd
import requests
import zipfile
import io
import time
import logging
from urllib.parse import urlencode

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

BTS_BASE_URL = "https://transtats.bts.gov/PREZIP/"

MONTHLY_FILES = [
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_1.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_2.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_3.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_4.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_5.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_6.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_7.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_8.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_9.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_10.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_11.zip",
    "On_Time_Reporting_Carrier_On_Time_Performance_2024_12.zip",
]

BTS_COLUMNS = [
    "FlightDate", "Reporting_Airline", "Origin", "Dest",
    "CRSDepTime", "DepTime", "CRSArrTime", "ArrTime",
    "FlightNumber", "Distance", "Diverted", "Cancelled",
    "DepDelay", "ArrDelay", "AirTime"
]

FARE_COLUMNS_TO_KEEP = [
    "FlightDate", "Reporting_Airline", "Origin", "Dest",
    "CRSDepTime", "DepTime", "CRSArrTime", "ArrTime",
    "Distance", "AirTime"
]


def download_bts_data(years=None):
    if years is None:
        years = [2024, 2025]
    all_dfs = []
    for year in years:
        for month in range(1, 13):
            url = f"{BTS_BASE_URL}On_Time_Reporting_Carrier_On_Time_Performance_{year}_{month}.zip"
            try:
                logger.info(f"Downloading {url}...")
                resp = requests.get(url, timeout=300)
                if resp.status_code != 200:
                    logger.warning(f"Failed: {resp.status_code}")
                    continue
                z = zipfile.ZipFile(io.BytesIO(resp.content))
                csv_file = [n for n in z.namelist() if n.endswith('.csv')][0]
                df = pd.read_csv(z.open(csv_file), low_memory=False)
                df['Year'] = year
                df['Month'] = month
                keep = [c for c in FARE_COLUMNS_TO_KEEP if c in df.columns]
                keep.extend(['Year', 'Month'])
                df = df[keep]
                all_dfs.append(df)
                logger.info(f"  -> {len(df)} rows, {year}-{month:02d}")
                time.sleep(1)
            except Exception as e:
                logger.warning(f"Error downloading {year}-{month}: {e}")
    if all_dfs:
        combined = pd.concat(all_dfs, ignore_index=True)
        out_path = os.path.join(DATA_DIR, 'bts_combined.parquet')
        combined.to_parquet(out_path, index=False)
        logger.info(f"Saved {len(combined)} rows to {out_path}")
        return combined
    return None


def download_kaggle_dataset():
    logger.info("Kaggle datasets require kagglehub or manual download.")
    logger.info("Run: pip install kagglehub")
    logger.info("Then: python -c \"import kagglehub; path = kagglehub.dataset_download('matinsajadi/flights')\"")
    logger.info("Or manually from: https://www.kaggle.com/datasets/matinsajadi/flights")


def generate_synthetic_fare_data(n_rows=100000):
    np.random.seed(42)
    airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia', 'Akasa Air', 'Jet Airways']
    cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa', 'Cochin', 'Chandigarh']
    data = {
        'Airline': np.random.choice(airlines, n_rows),
        'Source': np.random.choice(cities, n_rows),
        'Destination': np.random.choice(cities, n_rows),
        'Date_of_Journey': pd.date_range(start='2024-01-01', periods=n_rows, freq='h').strftime('%d/%m/%Y'),
        'Dep_Time': [f"{np.random.randint(0,24):02d}:{np.random.randint(0,60):02d}" for _ in range(n_rows)],
        'Arrival_Time': [f"{np.random.randint(0,24):02d}:{np.random.randint(0,60):02d}" for _ in range(n_rows)],
        'Duration': [f"{np.random.randint(1,10)}h {np.random.randint(0,60)}m" for _ in range(n_rows)],
        'Total_Stops': np.random.choice(['non-stop', '1 stop', '2 stops', '3 stops'], n_rows, p=[0.6, 0.2, 0.15, 0.05]),
        'Additional_Info': np.random.choice(['No info', 'In-flight meal', 'Business class', 'Extra baggage'], n_rows, p=[0.7, 0.15, 0.1, 0.05]),
    }
    df = pd.DataFrame(data)
    df = df[df['Source'] != df['Destination']].reset_index(drop=True)
    base_price = 3000
    airline_mult = {'IndiGo': 1.0, 'Air India': 1.3, 'SpiceJet': 0.8, 'Vistara': 1.5,
                    'GoAir': 0.9, 'AirAsia': 0.85, 'Akasa Air': 0.95, 'Jet Airways': 1.4}
    stops_mult = {'non-stop': 1.2, '1 stop': 1.0, '2 stops': 0.85, '3 stops': 0.75}
    dist = np.random.gamma(2, 500, len(df)) + 200
    noise = np.random.normal(0, 500, len(df))
    df['Price'] = (
        base_price
        * df['Airline'].map(airline_mult)
        * df['Total_Stops'].map(stops_mult)
        * (dist / 500)
        + noise
    ).clip(1000, 60000).astype(int)
    out_path = os.path.join(DATA_DIR, 'synthetic_fare_data.csv')
    df.to_csv(out_path, index=False)
    logger.info(f"Generated {len(df)} synthetic rows -> {out_path}")
    return df


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', choices=['bts', 'kaggle', 'synthetic', 'all'], default='synthetic')
    parser.add_argument('--rows', type=int, default=100000)
    args = parser.parse_args()
    if args.source in ('bts', 'all'):
        download_bts_data(years=[2024])
    if args.source in ('kaggle', 'all'):
        download_kaggle_dataset()
    if args.source in ('synthetic', 'all'):
        generate_synthetic_fare_data(n_rows=args.rows)
