# 🛰️ Satellite Error Prediction using Deep Learning (Please visit Our Deployed Website for visuals & results)

Predicting GPS satellite positioning errors 12 hours ahead using LSTM, Transformer, and Probabilistic models.

# 🎯 The Problem
GPS satellites aren't perfect. Their positions drift, atomic clocks drift, and these tiny errors compound into meters of positioning inaccuracy on your phone. This project predicts those errors before they happen.
Challenge: Given 7 days of satellite error history (sampled every 15 minutes), predict the next 12 hours with:

High accuracy (sub-meter for MEO satellites)
Normal error distribution (statistical reliability requirement)

# 📊 Results
| Satellite Type | Best Model     | MAE   | RMSE  | GEO |
|----------------|----------------|-------|-------|-----|
| Geostationary (36,000 km) | Transformer | 7.47m | 13.86m |   |
| MEO1 Medium Orbit (20,000 km) | Probabilistic | **0.12m ⭐** | **0.15m** |   |
| MEO2 Medium Orbit (20,000 km) | Transformer | **0.12m ⭐** | **0.14m** |   |

# Architecture

1. Bidirectional LSTM (64→32 units)
   ├─ Classic time series approach
   └─ Best for: Consistent, stable data

2. Transformer with Attention (4 heads)
   ├─ Self-attention mechanism
   └─ Best for: Volatile, non-linear patterns

3. Probabilistic LSTM (higher dropout)
   ├─ Uncertainty quantification
   └─ Best for: Small, precise variations
**Input**: 12 hours of history (48 × 15min intervals)  
**Output**: 12 hours of predictions (48 future steps)

---

## 🔧 Key Technical Decisions

| Challenge | Solution | Why |
|-----------|----------|-----|
| ±45m outliers in GEO | RobustScaler | Uses median/IQR, not mean/std |
| Irregular timestamps | Resample to 15min + interpolate | Uniform time grid |
| Small dataset | Early stopping + dropout | Prevent overfitting |
| Operational stability | Huber loss | Robust to outliers, smoother than MSE |


## 📁 Project Structure
```
satellite_gnss/
├── data/
│   ├── DATA_GEO_Train.csv      # Geostationary satellite
│   ├── DATA_MEO_Train.csv      # MEO satellite #1
│   └── DATA_MEO_Train2.csv     # MEO satellite #2
│
├── src/
│   ├── preprocessing.py        # Data cleaning & feature engineering
│   ├── Lstm.py                 # Bidirectional LSTM model
│   ├── Transformer.py          # Attention-based model
│   └── Probablistic.py         # Uncertainty-aware model
│
├── main_training_pipeline.py   # Train all models on all satellites
│
├── results/
│   ├── metrics_summary.csv     # Performance comparison
│   └── predictions_*.csv       # Model outputs
│
└── plots/
    └── comparison_*.png        # Visualizations
```
# 💡 Key Insights
1. Architecture Depends on Data Characteristics

Transformer won on volatile GEO (attention helps with spikes)
Probabilistic won on stable MEO1 (uncertainty helps with precision)
No universal "best" model

2. Operational vs. Theoretical Accuracy
GEO predictions are smooth (~3-5m) while actual jumps to 45m. This isn't a bug - it's a feature:

Predicting consistent 5m minimizes total error
Better than gambling on unpredictable spikes
Real systems need stability over occasional brilliance

3. Feature Engineering > Model Complexity
Added features based on orbital mechanics:

Lag features (autoregressive patterns)
Rolling windows (trend detection)
Cyclical time encoding (orbital periods)

These simple features beat any automated feature learning.
