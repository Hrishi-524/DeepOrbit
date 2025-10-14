import pandas as pd
import numpy as np
from sklearn.preprocessing import RobustScaler

# -------------------------------
# 1️⃣ Load and preprocess
# -------------------------------
def load_and_preprocess(path):
    # Load dataset, sort by utc_time, clean, and resample
    df = pd.read_csv(path)

    # Ensure correct time column
    df['utc_time'] = pd.to_datetime(df['utc_time'])
    df = df.sort_values('utc_time')
    df.set_index('utc_time', inplace=True)

    # Resample every 15 minutes and interpolate missing values
    df = df.resample('15 min').mean().interpolate()

    # Add radial error column
    df['radial_error_m'] = np.sqrt(
        df['x_error (m)']**2 + df['y_error (m)']**2 + df['z_error (m)']**2
    )

    # Drop any leftover NaNs
    df = df.dropna()

    return df


# -------------------------------
# 2️⃣ Feature Engineering
# -------------------------------
def add_features(df):
    # Add simple lag and rolling features
    df['radial_lag1'] = df['radial_error_m'].shift(1)
    df['radial_diff1'] = df['radial_error_m'].diff()
    df['radial_roll3'] = df['radial_error_m'].rolling(3).mean()
    df['radial_roll6'] = df['radial_error_m'].rolling(6).mean()

    df = df.dropna()
    return df


def add_temporal_features(df):
    """Add time-based cyclical features."""
    df['hour'] = df.index.hour
    df['day_of_week'] = df.index.dayofweek
    df['is_weekend'] = (df.index.dayofweek >= 5).astype(int)
    
    # Cyclical encoding for hour (24-hour cycle)
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    
    # Cyclical encoding for day of week (7-day cycle)
    df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
    df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
    
    # Drop the non-cyclical versions
    df = df.drop(['hour', 'day_of_week'], axis=1)
    
    return df


# Train/Test Split by Day
def split_train_test(df):
    # Split a dataframe into train and test using n-1 / 1 day split.
    df = df.sort_index()
    unique_days = df.index.normalize().unique()

    # Train: all but last day
    train_days = unique_days[:-1]
    test_day = unique_days[-1]

    df_train = df[df.index.normalize().isin(train_days)]
    df_test = df[df.index.normalize() == test_day]

    return df_train, df_test

# Train/Test Split by Percentage
def split_train_test_percentage(df, train_ratio=0.8):
    """
    Split a dataframe into train and test sets based on a percentage of the data.
    """
    df = df.sort_index()
    n_total = len(df)
    n_train = int(n_total * train_ratio)
    
    df_train = df.iloc[:n_train]
    df_test = df.iloc[n_train:]
    
    return df_train, df_test


# -------------------------------
# 4️⃣ Scaling
# -------------------------------
def scale_data(df_train, df_test, feature_cols, target_col):
    """Scale features and target using RobustScaler."""
    feature_scaler = RobustScaler()
    target_scaler = RobustScaler()

    X_train_scaled = feature_scaler.fit_transform(df_train[feature_cols])
    X_test_scaled = feature_scaler.transform(df_test[feature_cols])

    y_train_scaled = target_scaler.fit_transform(df_train[[target_col]])
    y_test_scaled = target_scaler.transform(df_test[[target_col]])

    return X_train_scaled, X_test_scaled, y_train_scaled, y_test_scaled, feature_scaler, target_scaler


# -------------------------------
# 5️⃣ Sequence Creator - FIXED
# -------------------------------
def create_sequences(X, y, seq_length=48, n_future=48):
    # Create sequences for LSTM.
    Xs, ys = [], []

    # Check if enough data
    min_required = seq_length + n_future
    if len(X) < min_required:
        n_future = max(1, len(X) - seq_length - 1)
        if n_future <= 0:
            print(f"Need at least {seq_length + 1} samples, got {len(X)}.")
            return np.empty((0, seq_length, X.shape[1])), np.empty((0, 1))

    # Create sequences
    for i in range(len(X) - seq_length - n_future + 1):
        # Input sequence
        Xs.append(X[i:i + seq_length])
        
        target_seq = y[i + seq_length:i + seq_length + n_future]
        ys.append(target_seq.flatten())  
    
    Xs = np.array(Xs)
    ys = np.array(ys)
    
    return Xs, ys
