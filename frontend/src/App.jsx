import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GEO from './pages/Geo';
import MEO1 from './pages/MEO1';
import MEO2 from './pages/MEO2';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/geo" element={<GEO />} />
          <Route path="/meo1" element={<MEO1 />} />
          <Route path="/meo2" element={<MEO2 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
