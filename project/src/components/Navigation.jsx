import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import CustomAuthModal from './CustomAuthModal';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-night-900/95 backdrop-blur-md border-b border-primary-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 animate-fade-in">
              <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400" />
              <span className="text-lg sm:text-2xl font-bold text-white font-display">
                3 am Buddy
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-sm lg:text-base text-gray-300 hover:text-primary-400 transition-colors duration-200 animate-slide-in-right">
                About
              </button>
              <button onClick={() => scrollToSection('features')} className="text-sm lg:text-base text-gray-300 hover:text-primary-400 transition-colors duration-200 animate-slide-in-right" style={{animationDelay: '0.1s'}}>
                Features
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm lg:text-base text-gray-300 hover:text-primary-400 transition-colors duration-200 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                Testimonials
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-sm lg:text-base text-gray-300 hover:text-primary-400 transition-colors duration-200 animate-slide-in-right" style={{animationDelay: '0.3s'}}>
                Contact Us
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <SignedOut>
                <button
                  onClick={() => handleAuthClick('signin')}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 lg:px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 text-sm lg:text-base animate-slide-in-left"
                  style={{animationDelay: '0.1s'}}
                >
                  Login
                </button>
                {/* <button
                  onClick={() => handleAuthClick('signup')}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 lg:px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 text-sm lg:text-base animate-slide-in-left"
                  style={{animationDelay: '0.1s'}}
                >
                  Register
                </button> */}
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile Menu Button with Animation */}
            <button onClick={toggleMenu} className="md:hidden text-white p-2 relative">
              <div className={`w-6 h-6 flex flex-col justify-center items-center transition-all duration-300 ${isMenuOpen ? 'hamburger-open' : ''}`}>
                <div className={`hamburger-line-1 w-6 h-0.5 bg-white rounded transition-all duration-300 ${isMenuOpen ? 'bg-white' : ''}`}></div>
                <div className={`hamburger-line-2 w-6 h-0.5 bg-white rounded mt-1.5 transition-all duration-300 ${isMenuOpen ? 'bg-white' : ''}`}></div>
                <div className={`hamburger-line-3 w-6 h-0.5 bg-white rounded mt-1.5 transition-all duration-300 ${isMenuOpen ? 'bg-white' : ''}`}></div>
              </div>
            </button>
          </div>

          {/* Mobile Menu with Animation */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="py-4 border-t border-primary-800/20">
              <div className="flex flex-col items-center space-y-4 text-center">
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-base text-gray-300 hover:text-primary-400 transition-colors duration-200 w-full py-3 animate-slide-in-bottom"
                  style={{animationDelay: '0.1s'}}
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="text-base text-gray-300 hover:text-primary-400 transition-colors duration-200 w-full py-3 animate-slide-in-bottom"
                  style={{animationDelay: '0.2s'}}
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="text-base text-gray-300 hover:text-primary-400 transition-colors duration-200 w-full py-3 animate-slide-in-bottom"
                  style={{animationDelay: '0.3s'}}
                >
                  Testimonials
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-base text-gray-300 hover:text-primary-400 transition-colors duration-200 w-full py-3 animate-slide-in-bottom"
                  style={{animationDelay: '0.4s'}}
                >
                  Contact Us
                </button>
                
                <div className="flex flex-col items-center space-y-3 pt-4 border-t border-primary-800/20 w-full">
                  <SignedOut>
                    <button
                      onClick={() => handleAuthClick('signin')}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105 text-base w-full animate-slide-in-bottom"
                      style={{animationDelay: '0.6s'}}
                    >
                      Login
                    </button>
                    {/* <button
                      onClick={() => handleAuthClick('signup')}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105 text-base w-full animate-slide-in-bottom"
                      style={{animationDelay: '0.6s'}}
                    >
                      Register
                    </button> */}
                  </SignedOut>
                  <SignedIn>
                    <div className="flex justify-center pt-2 animate-slide-in-bottom" style={{animationDelay: '0.5s'}}>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Custom Auth Modal */}
      <CustomAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
};

export default Navigation;