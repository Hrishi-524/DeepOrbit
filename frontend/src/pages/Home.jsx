import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        GNSS Satellite Error Prediction
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
        AI/ML-based prediction of time-varying satellite clock and ephemeris errors
      </p>
      
      <div style={{ 
        padding: '1.5rem', 
        background: '#eff6ff', 
        border: '1px solid #3b82f6',
        borderRadius: '8px',
        marginBottom: '3rem'
      }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Project Overview</h3>
        <p style={{ margin: 0, color: '#1e40af' }}>
          This system predicts satellite errors for Day 8 using 7 days of training data.
          Three models are compared: LSTM, Transformer, and Probabilistic.
        </p>
      </div>
      
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Select Dataset</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <Link to="/geo" style={{ textDecoration: 'none' }}>
          <div style={{ 
            border: '2px solid #3b82f6', 
            padding: '2rem', 
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌍</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e40af' }}>GEO</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Geostationary Earth Orbit satellites
            </p>
          </div>
        </Link>
        
        <Link to="/meo1" style={{ textDecoration: 'none' }}>
          <div style={{ 
            border: '2px solid #10b981', 
            padding: '2rem', 
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛰️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#059669' }}>MEO1</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Medium Earth Orbit satellites - Dataset 1
            </p>
          </div>
        </Link>
        
        <Link to="/meo2" style={{ textDecoration: 'none' }}>
          <div style={{ 
            border: '2px solid #f59e0b', 
            padding: '2rem', 
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📡</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#d97706' }}>MEO2</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Medium Earth Orbit satellites - Dataset 2
            </p>
          </div>
        </Link>
      </div>
      
      <div style={{ 
        marginTop: '3rem', 
        padding: '1.5rem', 
        background: '#f9fafb', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Key Metrics</h3>
        <ul style={{ lineHeight: '1.8', color: '#4b5563' }}>
          <li><strong>RMSE:</strong> Root Mean Squared Error (lower is better)</li>
          <li><strong>MAE:</strong> Mean Absolute Error (lower is better)</li>
          <li><strong>Shapiro p-value:</strong> Test for normal distribution of residuals (p &gt; 0.05 = good)</li>
        </ul>
      </div>
    </div>
  );
}