import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      background: '#1e40af', 
      color: 'white',
      marginBottom: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontSize: '1.5rem', 
          fontWeight: 'bold' 
        }}>
          🛰️ GNSS Predictor
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem', marginLeft: 'auto' }}>
          <Link 
            to="/" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: isActive('/') ? 'bold' : 'normal',
              borderBottom: isActive('/') ? '2px solid white' : 'none',
              paddingBottom: '0.25rem'
            }}
          >
            Home
          </Link>
          <Link 
            to="/geo" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: isActive('/geo') ? 'bold' : 'normal',
              borderBottom: isActive('/geo') ? '2px solid white' : 'none',
              paddingBottom: '0.25rem'
            }}
          >
            GEO
          </Link>
          <Link 
            to="/meo1" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: isActive('/meo1') ? 'bold' : 'normal',
              borderBottom: isActive('/meo1') ? '2px solid white' : 'none',
              paddingBottom: '0.25rem'
            }}
          >
            MEO1
          </Link>
          <Link 
            to="/meo2" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: isActive('/meo2') ? 'bold' : 'normal',
              borderBottom: isActive('/meo2') ? '2px solid white' : 'none',
              paddingBottom: '0.25rem'
            }}
          >
            MEO2
          </Link>
        </div>
      </div>
    </nav>
  );
}