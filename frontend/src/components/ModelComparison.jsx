import React from 'react';

export default function ModelComparison({ metrics }) {
  if (!metrics) return <div>Loading...</div>;
  
  const models = Object.keys(metrics);
  
  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      padding: '1.5rem', 
      borderRadius: '8px',
      background: 'white',
      marginTop: '2rem'
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Model Comparison</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Model</th>
            <th style={{ padding: '0.75rem', textAlign: 'right' }}>RMSE (m)</th>
            <th style={{ padding: '0.75rem', textAlign: 'right' }}>MAE (m)</th>
            <th style={{ padding: '0.75rem', textAlign: 'right' }}>Shapiro p</th>
            <th style={{ padding: '0.75rem', textAlign: 'center' }}>Normal?</th>
          </tr>
        </thead>
        <tbody>
          {models.map(model => (
            <tr key={model} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem', fontWeight: '600' }}>{model}</td>
              <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                {metrics[model].rmse.toFixed(4)}
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                {metrics[model].mae.toFixed(4)}
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                {metrics[model].shapiro_p.toFixed(4)}
              </td>
              <td style={{ 
                padding: '0.75rem', 
                textAlign: 'center',
                fontSize: '1.5rem',
                color: metrics[model].shapiro_p > 0.05 ? '#10b981' : '#ef4444'
              }}>
                {metrics[model].shapiro_p > 0.05 ? '✓' : '✗'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        background: '#f3f4f6', 
        borderRadius: '4px',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <strong>Note:</strong> Shapiro-Wilk p-value &gt; 0.05 indicates normally distributed residuals (required by ISRO)
      </div>
    </div>
  );
}