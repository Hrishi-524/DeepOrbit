import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Satellite, Radio, ArrowRight, BarChart3, Brain, Database } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
            Research Project
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            GNSS Satellite Error Prediction using Deep Learning
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            A comparative study of LSTM, Transformer, and Probabilistic models for 
            time-series forecasting of satellite positioning errors
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Abstract Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Abstract
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            This project implements three neural network architectures to predict satellite clock 
            and ephemeris errors. Using 7 days of historical GNSS data, we forecast errors for Day 8 
            at 15-minute intervals. The models are evaluated using RMSE, MAE, and Shapiro-Wilk tests 
            for residual normality, as required by ISRO competition guidelines.
          </p>
        </div>

        {/* Methodology Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
            <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">LSTM</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bidirectional LSTM with dropout regularization for temporal pattern learning
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-green-300 dark:hover:border-green-700 transition-colors">
            <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Transformer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Multi-head attention mechanism for long-range dependency capture
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
            <Database className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Probabilistic</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Uncertainty quantification through Monte Carlo dropout sampling
            </p>
          </div>
        </div>

        {/* Dataset Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Datasets & Results</h2>
          
          <div className="space-y-4">
            {/* GEO */}
            <Link to="/geo">
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 rounded-lg p-6 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">GEO Dataset</h3>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 rounded">
                          Geostationary
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Satellites at 36,000 km altitude with 24-hour orbital period. 
                        Fixed position relative to Earth's surface.
                      </p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-gray-500 dark:text-gray-500">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Altitude:</span> 36,000 km
                        </span>
                        <span className="text-gray-500 dark:text-gray-500">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Period:</span> 24 hours
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </div>
            </Link>

            {/* MEO1 */}
            <Link to="/meo1">
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 rounded-lg p-6 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Satellite className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">MEO1 Dataset</h3>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 rounded">
                          Medium Earth Orbit
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Navigation satellites at 20,000 km altitude with 12-hour orbital period. 
                        Primary GNSS constellation configuration.
                      </p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-gray-500 dark:text-gray-500">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Altitude:</span> 20,000 km
                        </span>
                        <span className="text-gray-500 dark:text-gray-500">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Period:</span> 12 hours
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </div>
            </Link>

            {/* MEO2 */}
            <Link to="/meo2">
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 rounded-lg p-6 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Radio className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">MEO2 Dataset</h3>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 rounded">
                          Medium Earth Orbit
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Alternative MEO configuration for comparative analysis. 
                        Similar altitude and period as MEO1.
                      </p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-gray-500 dark:text-gray-500">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Altitude:</span> 20,000 km
                        </span>
                        <span className="text-gray-500 dark:text-gray-500">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Period:</span> 12 hours
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Evaluation Metrics */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Evaluation Metrics</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-24 flex-shrink-0">
                <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">RMSE</span>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Root Mean Squared Error</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Measures prediction accuracy. Lower values indicate better model performance.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-24 flex-shrink-0">
                <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">MAE</span>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Mean Absolute Error</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Average magnitude of errors in predictions without considering direction.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-24 flex-shrink-0">
                <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">Shapiro p</span>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Shapiro-Wilk Test</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Tests residual normality. p-value &gt; 0.05 indicates normally distributed errors (required by ISRO).
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}