import React, { useState, useEffect } from 'react';
import { fetchMetrics } from '../services/api';
import MetricsCard from '../components/MetricsCard';
import ModelComparison from '../components/ModelComparison';
import ResidualPlots from '../components/ResidualPlots';

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
  
  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  if (!metrics) return <div style={{ textAlign: 'center', padding: '3rem' }}>Error loading data</div>;
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>MEO2 - Medium Earth Orbit</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Prediction results for medium earth orbit satellites (Dataset 2)
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Select Model:
        </label>
        <select 
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{ 
            padding: '0.5rem 1rem', 
            fontSize: '1rem', 
            borderRadius: '4px',
            border: '1px solid #d1d5db'
          }}
        >
          <option value="LSTM">LSTM</option>
          <option value="Transformer">Transformer</option>
          <option value="Probabilistic">Probabilistic</option>
        </select>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
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
          value={metrics[selectedModel].shapiro_p > 0.05 ? '✓ Normal' : '✗ Not Normal'} 
          color={metrics[selectedModel].shapiro_p > 0.05 ? '#10b981' : '#ef4444'}
        />
      </div>
      
      <ModelComparison metrics={metrics} />
      <ResidualPlots dataset="MEO2" model={selectedModel} />
    </div>
  );
}