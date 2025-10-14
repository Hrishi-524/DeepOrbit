import React from 'react';

export default function MetricsCard({ title, value, unit, color = '#3b82f6' }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Title */}
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </div>

      {/* Value */}
      <div 
        className="text-3xl font-bold mb-1"
        style={{ color }}
      >
        {value}
      </div>

      {/* Unit */}
      {unit && (
        <div className="text-xs text-gray-500 dark:text-gray-500">
          {unit}
        </div>
      )}
    </div>
  );
}