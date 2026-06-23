import React, { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl border-b border-white/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all">
              <Zap className="w-5 h-5 text-white" />
            </div>

            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              IntellMeet
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Features
            </a>

            <a
              href="#showcase"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Showcase
            </a>

            <a
              href="#pricing"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Pricing
            </a>

            <a
              href="#team"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              About
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">

            <Link 
              to="/login"
              className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-transparent text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-6 py-2.5 text-base gap-2"
            >
              Sign In
            </Link>

            <Link 
              to="/register"
              className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 px-6 py-2.5 text-base gap-2"
            >
              Get Started Free
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 dark:border-white/5 animate-slide-in-down">
            
            <div className="flex flex-col gap-4 pt-4">

              <a
                href="#features"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 font-medium"
              >
                Features
              </a>

              <a
                href="#showcase"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 font-medium"
              >
                Showcase
              </a>

              <a
                href="#pricing"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 font-medium"
              >
                Pricing
              </a>

              <a
                href="#team"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 font-medium"
              >
                About
              </a>

              <Link 
                to="/login"
                className="w-full inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-transparent text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-6 py-2.5 text-base gap-2 text-center"
              >
                Sign In
              </Link>

              <Link 
                to="/register"
                className="w-full inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 px-6 py-2.5 text-base gap-2 text-center"
              >
                Get Started Free
              </Link>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;