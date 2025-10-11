import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras import layers, Model 
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_squared_error, mean_absolute_error
import os
import warnings
warnings.filterwarnings('ignore')
from scipy import stats

from src.Lstm import LSTMModel
from src.Transformer import TransformerModel
from src.Probablistic import ProbabilisticModel
from src import preprocessing

def analyze_residual_normality(y_true, y_pred, model_name, dataset_name):
    """
    Analyze if residuals follow normal distribution (CRITICAL FOR ISRO)
    """
    # Calculate residuals
    residuals = (y_true - y_pred).flatten()
    
    # Remove any NaN/Inf
    residuals = residuals[np.isfinite(residuals)]
    
    # Statistical tests for normality
    shapiro_stat, shapiro_p = stats.shapiro(residuals[:5000])  # Shapiro-Wilk test
    
    # Additional statistics
    mean_res = np.mean(residuals)
    std_res = np.std(residuals)
    skewness = stats.skew(residuals)
    kurtosis = stats.kurtosis(residuals)
    
    # Print results
    print(f"\n{'='*60}")
    print(f"RESIDUAL NORMALITY - {model_name} on {dataset_name}")
    print(f"{'='*60}")
    print(f"Mean:              {mean_res:.6f}")
    print(f"Std Dev:           {std_res:.4f}")
    print(f"Skewness:          {skewness:.4f} (ideal: ~0)")
    print(f"Kurtosis:          {kurtosis:.4f} (ideal: ~0)")
    print(f"Shapiro-Wilk p:    {shapiro_p:.6f}")
    
    if shapiro_p > 0.05:
        print(f"✓ NORMAL distribution (p > 0.05)")
    else:
        print(f"✗ NOT normal (p < 0.05)")
    
    # Create plots
    fig, axes = plt.subplots(1, 3, figsize=(15, 4))
    fig.suptitle(f'Residual Analysis - {model_name} ({dataset_name})', fontsize=14, fontweight='bold')
    
    # 1. Histogram with normal curve overlay
    ax = axes[0]
    ax.hist(residuals, bins=50, density=True, alpha=0.7, color='blue', edgecolor='black')
    
    # Overlay normal distribution curve
    mu, sigma = mean_res, std_res
    x = np.linspace(residuals.min(), residuals.max(), 100)
    ax.plot(x, stats.norm.pdf(x, mu, sigma), 'r-', linewidth=2, label='Normal curve')
    
    ax.set_title(f'Histogram\nShapiro p={shapiro_p:.4f}')
    ax.set_xlabel('Residual (m)')
    ax.set_ylabel('Density')
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    # 2. Q-Q Plot (most important!)
    ax = axes[1]
    stats.probplot(residuals, dist="norm", plot=ax)
    ax.set_title('Q-Q Plot\n(Should follow red line)')
    ax.grid(True, alpha=0.3)
    
    # 3. Residuals vs Predicted (check for patterns)
    ax = axes[2]
    ax.scatter(y_pred.flatten(), residuals, alpha=0.3, s=10)
    ax.axhline(y=0, color='r', linestyle='--', linewidth=2)
    ax.set_title('Residuals vs Predicted\n(Should be random scatter)')
    ax.set_xlabel('Predicted Value (m)')
    ax.set_ylabel('Residual (m)')
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'plots/residuals_{model_name.lower()}_{dataset_name}.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"✓ Plot saved to plots/residuals_{model_name.lower()}_{dataset_name}.png")
    
    return shapiro_p


def train_all_models(data_path, dataset_name):
    """Train all 3 models on a dataset"""
    
    print(f"PROCESSING: {dataset_name}")
    
    # Load and preprocess
    df = preprocessing.load_and_preprocess(data_path)
    df = preprocessing.add_features(df)
    df_train, df_test = preprocessing.split_train_test(df)

    X_train_scaled, X_test_scaled, y_train_scaled, y_test_scaled, f_scaler, t_scaler = \
        preprocessing.scale_data(
            df_train, df_test,
            feature_cols=['radial_lag1', 'radial_diff1', 'radial_roll3', 'radial_roll6'],
            target_col='radial_error_m'
        )

    if dataset_name == "MEO2":
        seq_length_hr = 8   
        n_future_hr = 4     
    else:
        seq_length_hr = 12
        n_future_hr = 12

    seq_length = int((seq_length_hr * 60) / 15)
    n_future = int((n_future_hr * 60) / 15)

    X_train_seq, y_train_seq = preprocessing.create_sequences(
        X_train_scaled, y_train_scaled, seq_length, n_future
    )
    X_test_seq, y_test_seq = preprocessing.create_sequences(
        X_test_scaled, y_test_scaled, seq_length, n_future
    )
    
    print(f"Train sequences: {X_train_seq.shape[0]}, Test sequences: {X_test_seq.shape[0]}")
    
    if X_train_seq.shape[0] < 10:
        print(f"Only {X_train_seq.shape[0]} training sequences. Results may be poor.")
    
    results = {}
    
    # Train all 3 models
    models = {
        'LSTM': LSTMModel,
        'Transformer': TransformerModel,
        'Probabilistic': ProbabilisticModel
    }
    
    for model_name, ModelClass in models.items():
        print(f"\n  Training {model_name}...", end=" ")
        
        model = ModelClass(
            input_shape=(X_train_seq.shape[1], X_train_seq.shape[2]),
            output_steps=y_train_seq.shape[1]
        )
        
        history = model.train(X_train_seq, y_train_seq, epochs=100, batch_size=8)
        
        # Predict
        y_pred_scaled = model.predict(X_test_seq)

        # Check shapes before reshaping
        print(f"    Pred shape: {y_pred_scaled.shape}, True shape: {y_test_seq.shape}")

        # Ensure both have same shape
        min_samples = min(y_pred_scaled.shape[0], y_test_seq.shape[0])
        y_pred_scaled = y_pred_scaled[:min_samples]
        y_test_seq_trimmed = y_test_seq[:min_samples]

        # Flatten and inverse transform
        y_pred_flat = y_pred_scaled.reshape(-1, 1)
        y_test_flat = y_test_seq_trimmed.reshape(-1, 1)

        # Make sure they match
        if y_pred_flat.shape[0] != y_test_flat.shape[0]:
            min_len = min(y_pred_flat.shape[0], y_test_flat.shape[0])
            y_pred_flat = y_pred_flat[:min_len]
            y_test_flat = y_test_flat[:min_len]

        y_pred = t_scaler.inverse_transform(y_pred_flat)
        y_true = t_scaler.inverse_transform(y_test_flat)
        
        # Calculate metrics
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        mae = mean_absolute_error(y_true, y_pred)
          
        shapiro_p = analyze_residual_normality(y_true, y_pred, model_name, dataset_name)
        
        results[model_name] = {
            'model': model,
            'history': history,
            'y_true': y_true,
            'y_pred': y_pred,
            'rmse': rmse,
            'mae': mae,
            'shapiro_p': shapiro_p 
        }
        
        print(f"RMSE: {rmse:.4f}m, MAE: {mae:.4f}m, Normality p: {shapiro_p:.4f}")
        
        # Save model
        model.model.save(f"models/{model_name.lower()}_{dataset_name}.h5")
        
        # Save predictions
        pred_df = pd.DataFrame({
            'y_true': y_true.flatten(),
            'y_pred': y_pred.flatten(),
            'error': (y_true - y_pred).flatten()
        })
        pred_df.to_csv(f"results/predictions_{model_name.lower()}_{dataset_name}.csv", index=False)

    
    # Plot comparison
    plot_comparison(results, dataset_name)
    
    return results

def plot_comparison(results, dataset_name):
    """Create comparison plots"""
    
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle(f'Model Comparison - {dataset_name}', fontsize=16)
    
    # 1. Predictions comparison
    ax = axes[0, 0]
    for model_name, res in results.items():
        y_true = res['y_true'][:100]  # First 100 points
        y_pred = res['y_pred'][:100]
        ax.plot(y_pred, label=f'{model_name} (pred)', alpha=0.7)
    ax.plot(y_true, 'k--', label='True', linewidth=2)
    ax.set_title('Predictions Comparison')
    ax.set_xlabel('Time Step')
    ax.set_ylabel('Radial Error (m)')
    ax.legend()
    ax.grid(True)
    
    # 2. Error distributions
    ax = axes[0, 1]
    for model_name, res in results.items():
        errors = res['y_true'] - res['y_pred']
        ax.hist(errors, bins=30, alpha=0.5, label=model_name)
    ax.set_title('Error Distributions')
    ax.set_xlabel('Error (m)')
    ax.set_ylabel('Count')
    ax.legend()
    ax.grid(True)
    
    # 3. Training history
    ax = axes[1, 0]
    for model_name, res in results.items():
        history = res['history'].history
        ax.plot(history['val_loss'], label=f'{model_name}')
    ax.set_title('Validation Loss')
    ax.set_xlabel('Epoch')
    ax.set_ylabel('Loss')
    ax.legend()
    ax.grid(True)
    ax.set_yscale('log')
    
    # 4. Metrics comparison
    ax = axes[1, 1]
    model_names = list(results.keys())
    rmses = [results[m]['rmse'] for m in model_names]
    maes = [results[m]['mae'] for m in model_names]
    
    x = np.arange(len(model_names))
    width = 0.35
    ax.bar(x - width/2, rmses, width, label='RMSE', alpha=0.8)
    ax.bar(x + width/2, maes, width, label='MAE', alpha=0.8)
    ax.set_title('Metrics Comparison')
    ax.set_ylabel('Error (m)')
    ax.set_xticks(x)
    ax.set_xticklabels(model_names)
    ax.legend()
    ax.grid(True, axis='y')
    
    plt.tight_layout()
    plt.savefig(f'plots/comparison_{dataset_name}.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"  ✓ Plots saved to plots/comparison_{dataset_name}.png")

if __name__ == "__main__":
    print("SATELLITE ERROR PREDICTION - QUICK TRAINING")
    
    datasets = [
        ("./data/DATA_GEO_Train.csv", "GEO"),
        ("./data/DATA_MEO_Train.csv", "MEO1"),
        ("./data/DATA_MEO_Train2.csv", "MEO2"),
    ]
    
    all_results = {}
    
    for data_path, dataset_name in datasets:
        if os.path.exists(data_path):
            try:
                results = train_all_models(data_path, dataset_name)
                all_results[dataset_name] = results
            except Exception as e:
                print(f"Error processing {dataset_name}: {e}")
        else:
            print(f"File not found: {data_path}")
    
    print("FINAL RESULTS SUMMARY")
    
    summary_data = []
    for dataset_name, results in all_results.items():
        for model_name, res in results.items():
            summary_data.append({
                'Dataset': dataset_name,
                'Model': model_name,
                'RMSE (m)': f"{res['rmse']:.4f}",
                'MAE (m)': f"{res['mae']:.4f}",
                'Shapiro p': f"{res['shapiro_p']:.4f}",  
                'Normal?': 'YES' if res['shapiro_p'] > 0.05 else 'NO'
            })
    
    summary_df = pd.DataFrame(summary_data)
    print(summary_df.to_string(index=False))
    
    summary_df.to_csv('results/metrics_summary.csv', index=False)
    print("\nSummary saved to results/metrics_summary.csv")
    
    print("\n" + "="*70)
    print("TRAINING COMPLETE!")
    print("="*70)
    print("\nFiles generated:")
    print("  - models/*.h5 (trained models)")
    print("  - results/*.csv (predictions and metrics)")
    print("  - plots/*.png (comparison visualizations)")