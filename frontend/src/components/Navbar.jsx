import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { Satellite } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/geo', label: 'GEO' },
    { path: '/meo1', label: 'MEO1' },
    { path: '/meo2', label: 'MEO2' }
  ];
  
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
          >
            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Satellite className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-lg font-bold hidden sm:inline-block">GNSS Predictor</span>
            <span className="text-lg font-bold sm:hidden">GNSS</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive(link.path) 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Dark Mode Toggle */}
            <div className="ml-2 border-l border-gray-200 dark:border-gray-700 pl-2">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}