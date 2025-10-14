import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ModelComparison({ metrics }) {
  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">Loading comparison data...</p>
      </div>
    );
  }
  
  const models = Object.keys(metrics);
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Model Comparison
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Model
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                RMSE (m)
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                MAE (m)
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                Shapiro p
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                Normal Distribution
              </th>
            </tr>
          </thead>
          <tbody>
            {models.map(model => {
              const isNormal = metrics[model].shapiro_p > 0.05;
              
              return (
                <tr 
                  key={model} 
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                    {model}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 font-mono text-sm">
                    {metrics[model].rmse.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 font-mono text-sm">
                    {metrics[model].mae.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 font-mono text-sm">
                    {metrics[model].shapiro_p.toFixed(4)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {isNormal ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Yes
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">
                            No
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          <span className="font-semibold">Note:</span> Shapiro-Wilk p-value greater than 0.05 indicates 
          normally distributed residuals, which is a key requirement for ISRO competition evaluation.
        </p>
      </div>
    </div>
  );
}