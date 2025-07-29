import { Moon, Heart, Shield, Globe, Mail, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-night-900 border-t border-primary-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Moon className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold text-white font-display">
                3 am Buddy
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Your AI companion for those quiet hours when you need someone to talk to. 
              Available 24/7 in English, Hindi, and Gujarati.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-400">
                <Heart className="w-4 h-4 text-red-400 mr-2" />
                Made with care for youth mental health
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal & Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Mental Health Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Crisis Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-primary-800/20 pt-8 mt-8">
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            <div className="flex items-center bg-night-800/50 rounded-full px-4 py-2 border border-primary-500/20">
              <Shield className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-gray-300 text-sm">100% Secure</span>
            </div>
            <div className="flex items-center bg-night-800/50 rounded-full px-4 py-2 border border-primary-500/20">
              <Globe className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-gray-300 text-sm">Multilingual</span>
            </div>
            <div className="flex items-center bg-night-800/50 rounded-full px-4 py-2 border border-primary-500/20">
              <Heart className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-gray-300 text-sm">Youth Focused</span>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-primary-800/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} 3 am Buddy. All rights reserved. Built with ❤️ for mental wellness.
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-4">Follow us:</span>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="mailto:support@3ambuddy.com" 
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-8 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/20 rounded-2xl p-6 text-center">
          <p className="text-red-200 text-sm leading-relaxed">
            <strong>Crisis Support:</strong> If you're experiencing a mental health emergency, 
            please contact your local emergency services or call our crisis line at 1-800-BUDDY-24. 
            3 am Buddy is not a replacement for professional mental health care.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;