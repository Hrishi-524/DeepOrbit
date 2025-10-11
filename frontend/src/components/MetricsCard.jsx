import React from 'react';

export default function MetricsCard({ title, value, unit, color = '#3b82f6' }) {
  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      padding: '1.5rem', 
      borderRadius: '8px',
      background: 'white'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
        {title}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>
        {value}
      </div>
      {unit && (
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
          {unit}
        </div>
      )}
    </div>
  );
}