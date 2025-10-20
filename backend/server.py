from flask import Flask, send_file, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})

@app.route('/api/plots/<filename>')
def get_plot(filename):
    """Serve any plot image"""
    plot_path = os.path.join(BASE_DIR, 'plots', filename)
    if os.path.exists(plot_path):
        return send_file(plot_path, mimetype='image/png')
    return jsonify({"error": f"Plot not found: {filename}"}), 404

@app.route('/api/metrics')
def get_metrics():
    """Get all metrics from metrics_summary.csv"""
    csv_path = os.path.join(BASE_DIR, 'results', 'metrics_summary.csv')
    
    if not os.path.exists(csv_path):
        return jsonify({"error": "Metrics file not found"}), 404
    
    df = pd.read_csv(csv_path)
    
    # Group by Dataset and Model
    results = {}
    for _, row in df.iterrows():
        dataset = row['Dataset']
        model = row.get('Model', 'LSTM')  # Default to LSTM if no model column
        
        if dataset not in results:
            results[dataset] = {}
        
        # Clean and parse metrics
        try:
            rmse = float(str(row['RMSE (m)']).replace('m', '').strip())
            mae = float(str(row['MAE (m)']).replace('m', '').strip())
            shapiro = float(row.get('Shapiro p', 0.0)) if 'Shapiro p' in df.columns else None
            
            results[dataset][model] = {
                'rmse': round(rmse, 4),
                'mae': round(mae, 4),
                'shapiro_p': round(shapiro, 4) if shapiro else None,
                'normal': shapiro > 0.05 if shapiro else False
            }
        except Exception as e:
            print(f"Error parsing row: {e}")
            continue
    
    return jsonify(results)

@app.route('/api/predictions/<dataset>')
def get_predictions(dataset):
    """Get predictions for a specific dataset (handles multiple models)"""
    results = {}
    
    # Try to find all prediction files for this dataset
    results_dir = os.path.join(BASE_DIR, 'results')
    
    for filename in os.listdir(results_dir):
        if filename.startswith('predictions_') and dataset.upper() in filename.upper() and filename.endswith('.csv'):
            # Extract model name (e.g., lstm, probabilistic)
            parts = filename.replace('.csv', '').split('_')
            model_name = parts[1] if len(parts) > 2 else 'lstm'
            
            csv_path = os.path.join(results_dir, filename)
            df = pd.read_csv(csv_path)
            
            # Limit to first 500 points for performance
            results[model_name] = df.head(500).to_dict('records')
    
    if not results:
        return jsonify({"error": f"No predictions found for {dataset}"}), 404
    
    return jsonify(results)

@app.route('/api/available-plots')
def available_plots():
    """List all available plots grouped by type and dataset"""
    plots_dir = os.path.join(BASE_DIR, 'plots')
    
    if not os.path.exists(plots_dir):
        return jsonify({"error": "Plots directory not found"}), 404
    
    all_plots = [f for f in os.listdir(plots_dir) if f.endswith('.png')]
    
    # Group plots by category
    grouped = {
        'GEO': [],
        'MEO1': [],
        'MEO2': [],
        'comparison': [],
        'other': []
    }
    
    for plot in all_plots:
        if 'GEO' in plot.upper():
            grouped['GEO'].append(plot)
        elif 'MEO1' in plot.upper():
            grouped['MEO1'].append(plot)
        elif 'MEO2' in plot.upper():
            grouped['MEO2'].append(plot)
        elif 'comparison' in plot.lower():
            grouped['comparison'].append(plot)
        else:
            grouped['other'].append(plot)
    
    return jsonify(grouped)

@app.route('/api/datasets')
def get_datasets():
    """Get list of available datasets"""
    return jsonify(['GEO', 'MEO1', 'MEO2'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 