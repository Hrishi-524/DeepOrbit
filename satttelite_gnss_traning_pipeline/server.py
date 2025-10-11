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
    plot_path = os.path.join(BASE_DIR, 'plots', filename)
    if os.path.exists(plot_path):
        return send_file(plot_path, mimetype='image/png')
    return jsonify({"error": "Plot not found"}), 404

@app.route('/api/metrics')
def get_metrics():
    csv_path = os.path.join(BASE_DIR, 'results', 'metrics_summary.csv')
    df = pd.read_csv(csv_path)
    
    results = {}
    for _, row in df.iterrows():
        dataset = row['Dataset']
        model = row['Model']
        
        if dataset not in results:
            results[dataset] = {}
        
        # Parse metrics (remove 'm' suffix if present)
        rmse = float(str(row['RMSE (m)']).replace('m', '').strip())
        mae = float(str(row['MAE (m)']).replace('m', '').strip())
        shapiro = float(row.get('Shapiro p', 0.0)) if 'Shapiro p' in df.columns else 0.0
        
        results[dataset][model] = {
            'rmse': rmse,
            'mae': mae,
            'shapiro_p': shapiro,
            'normal': shapiro > 0.05
        }
    
    return jsonify(results)

@app.route('/api/predictions/<model>/<dataset>')
def get_predictions(model, dataset):
    filename = f'predictions_{model.lower()}_{dataset.lower()}.csv'
    csv_path = os.path.join(BASE_DIR, 'results', filename)
    
    if not os.path.exists(csv_path):
        return jsonify({"error": "Predictions not found"}), 404
    
    df = pd.read_csv(csv_path)
    # Limit to first 100 points for performance
    return jsonify(df.head(100).to_dict('records'))

@app.route('/api/available-plots')
def available_plots():
    plots_dir = os.path.join(BASE_DIR, 'plots')
    plots = [f for f in os.listdir(plots_dir) if f.endswith('.png')]
    return jsonify(plots)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)