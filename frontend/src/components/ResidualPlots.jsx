import React from 'react';
import { getPlotUrl } from '../services/api';

export default function ResidualPlots({ dataset, model }) {
  const plotFilename = `residuals_${model.toLowerCase()}_${dataset}.png`;
  const comparisonFilename = `comparison_${dataset}.png`;
  
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Residual Analysis - {model}</h2>
      
      <div style={{ 
        border: '1px solid #e5e7eb', 
        padding: '1rem', 
        borderRadius: '8px',
        background: 'white',
        marginBottom: '1.5rem'
      }}>
        <img 
          src={getPlotUrl(plotFilename)} 
          alt={`${model} residuals for ${dataset}`}
          style={{ width: '100%', height: 'auto' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x400?text=Plot+Not+Found';
          }}
        />
      </div>
      
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>All Models Comparison</h2>
      
      <div style={{ 
        border: '1px solid #e5e7eb', 
        padding: '1rem', 
        borderRadius: '8px',
        background: 'white'
      }}>
        <img 
          src={getPlotUrl(comparisonFilename)} 
          alt={`Comparison for ${dataset}`}
          style={{ width: '100%', height: 'auto' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x800?text=Comparison+Plot+Not+Found';
          }}
        />
      </div>
    </div>
  );
}
