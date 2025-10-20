import React, { useState, useEffect } from 'react';
import { fetchMetrics } from '../services/api';
import MetricsCard from '../components/MetricsCard';
import ModelComparison from '../components/ModelComparison';
import ResidualPlots from '../components/ResidualPlots';
import { Radio, ChevronDown, Loader, AlertTriangle } from 'lucide-react';

export default function MEO2() {
  const [metrics, setMetrics] = useState(null);
  const [selectedModel, setSelectedModel] = useState('LSTM');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMetrics()
      .then(data => {
        setMetrics(data.MEO2);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading MEO2 dataset results...</p>
      </div>
    );
  }
  
  if (!metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400 mb-4" />
        <p className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Error loading data</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Please check if the backend server is running</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Radio className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">MEO2 Dataset Results</h1>
                <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-xs font-medium text-purple-700 dark:text-purple-300 rounded">
                  Medium Earth Orbit
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Prediction results for medium earth orbit satellites at 20,000 km altitude (Dataset 2)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Model Selector */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Select Model for Analysis
          </label>
          <div className="relative inline-block w-full max-w-xs">
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
            >
              <option value="LSTM">LSTM - Long Short-Term Memory</option>
              <option value="Transformer">Transformer - Attention Mechanism</option>
              <option value="Probabilistic">Probabilistic - Monte Carlo Dropout</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>
        
        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricsCard 
            title="RMSE" 
            value={metrics[selectedModel].rmse.toFixed(4)} 
            unit="meters"
            color="#3b82f6"
          />
          <MetricsCard 
            title="MAE" 
            value={metrics[selectedModel].mae.toFixed(4)} 
            unit="meters"
            color="#10b981"
          />
          <MetricsCard 
            title="Shapiro p-value" 
            value={metrics[selectedModel].shapiro_p.toFixed(4)} 
            unit="normality test"
            color="#8b5cf6"
          />
          <MetricsCard 
            title="Residuals" 
            value={metrics[selectedModel].shapiro_p > 0.05 ? 'Normal' : 'Not Normal'} 
            color={metrics[selectedModel].shapiro_p > 0.05 ? '#10b981' : '#ef4444'}
          />
        </div>

        {/* Success Banner for Normal Residuals */}
        {metrics[selectedModel].shapiro_p > 0.05 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <div className="text-green-600 dark:text-green-400 text-xl flex-shrink-0">✓</div>
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-200 mb-1">
                  Normal residual distribution confirmed
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Shapiro-Wilk p-value is greater than 0.05, indicating normally distributed residuals. 
                  This meets ISRO competition requirements for statistical validation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warning Banner for Non-Normal Residuals */}
        {metrics[selectedModel].shapiro_p <= 0.05 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-1">
                  Non-normal residual distribution detected
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Shapiro-Wilk p-value is less than 0.05. Consider additional preprocessing or hyperparameter tuning.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Model Comparison Table */}
        <div className="mb-6">
          <ModelComparison metrics={metrics} />
        </div>
        
        {/* Residual Plots */}
        <div>
          <ResidualPlots dataset="MEO2" model={selectedModel} />
        </div>
      </div>
    </div>
  );
}