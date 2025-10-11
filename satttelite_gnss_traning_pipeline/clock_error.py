import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import tensorflow as tf
from tensorflow.keras import layers, Sequential
from tensorflow.keras.callbacks import EarlyStopping
import warnings
warnings.filterwarnings('ignore')

file_path = "./data/DATA_GEO_Train.csv"
df = pd.read_csv(file_path)
df['utc_time'] = pd.to_datetime(df['utc_time'])
df = df.set_index('utc_time').sort_index()

df = df.resample('1H').interpolate()

for col in ['x_error (m)','y_error (m)','z_error (m)','satclockerror (m)']:
    df[col] = df[col].clip(lower=df[col].quantile(0.01),
                            upper=df[col].quantile(0.99))

df['radial_error'] = np.sqrt(df['x_error (m)']**2 + df['y_error (m)']**2 + df['z_error (m)']**2)
df['dx'] = df['x_error (m)'].diff().fillna(0)
df['dy'] = df['y_error (m)'].diff().fillna(0)
df['dz'] = df['z_error (m)'].diff().fillna(0)
df['dclock'] = df['satclockerror (m)'].diff().fillna(0)

features = ['x_error (m)','y_error (m)','z_error (m)','radial_error',
            'dx','dy','dz','dclock','satclockerror (m)']

scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(df[features])
df_scaled = pd.DataFrame(scaled_data, columns=features, index=df.index)

def create_sequences(data, lookback=6, forecast_horizon=1):
    X, y = [], []
    for i in range(len(data) - lookback - forecast_horizon + 1):
        X.append(data[i:i+lookback, :-1])      # all features except target
        y.append(data[i+lookback:i+lookback+forecast_horizon, -1])  # target = satclockerror
    return np.array(X), np.array(y)

lookback = 6
X, y = create_sequences(df_scaled.values, lookback=lookback)

split_idx = int(0.8 * len(X))
X_train, X_val = X[:split_idx], X[split_idx:]
y_train, y_val = y[:split_idx], y[split_idx:]

model = Sequential([
    layers.LSTM(64, return_sequences=True, input_shape=(lookback, X.shape[2])),
    layers.Dropout(0.2),
    layers.LSTM(32, return_sequences=False),
    layers.Dropout(0.2),
    layers.Dense(16, activation='relu'),
    layers.Dense(1)
])

model.compile(optimizer='adam', loss=tf.keras.losses.Huber(), metrics=['mae'])
model.summary()

early_stop = EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True)
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=100,
    batch_size=16,
    callbacks=[early_stop],
    verbose=1
)

y_pred = model.predict(X_val)

rmse = np.sqrt(mean_squared_error(y_val, y_pred))
mae = mean_absolute_error(y_val, y_pred)
print(f"\nLSTM - RMSE: {rmse:.4f}, MAE: {mae:.4f}")

plt.figure(figsize=(12,5))
plt.plot(y_val[:50], label='Actual', marker='o')
plt.plot(y_pred[:50], label='Predicted', marker='s')
plt.title('Clock Error Prediction - LSTM')
plt.xlabel('Sample')
plt.ylabel('Normalized Error')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig(f'plots/clock_error_prediction.png', dpi=300, bbox_inches='tight')

plt.figure(figsize=(10,4))
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Training Loss')
plt.xlabel('Epoch')
plt.ylabel('Huber Loss')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig(f'plots/clock_error_loss.png', dpi=300, bbox_inches='tight')

def mc_dropout_predictions(model, X, n_iter=50):
    """
    Perform Monte Carlo Dropout by predicting multiple times with dropout active.
    Returns mean and std of predictions.
    """
    predictions = []
    for _ in range(n_iter):
        y_pred = model(X, training=True).numpy()  # training=True keeps dropout active
        predictions.append(y_pred)
    preds = np.array(predictions)
    mean_pred = preds.mean(axis=0)
    std_pred = preds.std(axis=0)
    return mean_pred, std_pred

mean_pred, std_pred = mc_dropout_predictions(model, X_val, n_iter=50)

rmse_mc = np.sqrt(mean_squared_error(y_val, mean_pred))
mae_mc = mean_absolute_error(y_val, mean_pred)
print(f"\nMonte Carlo LSTM - RMSE: {rmse_mc:.4f}, MAE: {mae_mc:.4f}")
print(f"Mean predicted uncertainty (std): {std_pred.mean():.4f}")

plt.figure(figsize=(12,5))
samples = min(50, len(X_val))

y_actual = y_val[:samples].squeeze()
y_mean = mean_pred[:samples].squeeze()
y_std = std_pred[:samples].squeeze()

plt.figure(figsize=(12,5))
plt.plot(y_actual, label='Actual', marker='o')
plt.plot(y_mean, label='Predicted', marker='s')
plt.fill_between(range(samples),
                 y_mean - y_std,
                 y_mean + y_std,
                 color='orange', alpha=0.3, label='Uncertainty')
plt.title('Clock Error Prediction - LSTM with Uncertainty')
plt.xlabel('Sample')
plt.ylabel('Normalized Error')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig(f'plots/clock_uncertainity.png')
plt.close()