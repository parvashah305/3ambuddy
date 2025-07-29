import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, MessageCircle, Phone, Calendar, X } from 'lucide-react';
import { useAuth, UserButton} from '@clerk/clerk-react';
import api from '../lib/axios';

const FeatureSelectionPage = ({ user }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const navigate = useNavigate();


  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const sendTokenToBackend = async () => {
      if (!isSignedIn) return;

      const token = await getToken(); // ✅ Only fetch token
      const res = await api.get('/protected', { headers: { 'X_AUTH_TOKEN': token } });
    };

    sendTokenToBackend();
  }, [getToken, isSignedIn]);


  useEffect(() => {
    if (localStorage.getItem('showGoogleAuthToast')) {
      setShowToast({ type: 'success', message: 'Signed in successfully with Google!' });
      localStorage.removeItem('showGoogleAuthToast');
    }
  }, []);


  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const features = [
    {
      id: 'chat',
      icon: MessageCircle,
      title: '24/7 Text Chat',
      description: 'Start a conversation with your AI buddy anytime. Perfect for those late-night thoughts and feelings.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-900/30 to-cyan-900/30',
      available: true,
      route: '/chat'
    },
    {
      id: 'voice-call',
      icon: Phone,
      title: 'Voice Call with AI Buddy',
      description: 'Have a real conversation through voice calls. More personal and comforting than text.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-900/30 to-emerald-900/30',
      available: true,
      route: '/voice-call'
    },
    {
      id: 'schedule-call',
      icon: Calendar,
      title: 'Schedule a Call',
      description: 'Set a time and your AI buddy will call you. Never miss your daily check-in.',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-900/30 to-violet-900/30',
      available: false,
      // route: '/schedule-call'
    }
  ];

  const handleFeatureSelect = (feature) => {
    if (feature.available) {
      navigate(feature.route);
    } else {
      setSelectedFeature(feature.id);
      // For demo purposes, show coming soon message
      setTimeout(() => {
        setSelectedFeature(null);
      }, 2000);
    }
  };

  return (
    <>
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-night-800 border rounded-2xl p-4 shadow-xl transform transition-all duration-300 ${
          showToast.type === 'success'
            ? 'border-green-500/50 bg-gradient-to-r from-green-900/20 to-emerald-900/20'
            : 'border-red-500/50 bg-gradient-to-r from-red-900/20 to-orange-900/20'
        }`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
              showToast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {showToast.type === 'success' ? '✅' : '❌'}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{showToast.message}</p>
            </div>
            <button
              onClick={() => setShowToast(null)}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-900 to-night-800">
        {/* Header */}
        <header className="bg-night-900/95 backdrop-blur-md border-b border-primary-800/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400" />
                <span className="text-xl sm:text-2xl font-bold text-white font-display">3 am Buddy</span>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Welcome Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 font-display">
              Welcome back, {user?.firstName || user?.username || 'User'}!
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your AI buddy <span className="text-primary-400 font-semibold">Buddy</span> is 
              ready to chat. Choose how you'd like to connect today.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 transform hover:scale-105 cursor-pointer border-primary-500/20 hover:border-primary-400/40`}
                style={{
                  background: `linear-gradient(135deg, ${feature.bgColor.replace('from-', '').replace(' to-', ', ')})`
                }}
                onClick={() => handleFeatureSelect(feature)}
              >
                <div className="p-6 sm:p-8 text-center relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6 transition-transform duration-300 bg-gradient-to-r ${feature.color} group-hover:scale-110`}>
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-primary-300 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6">
                    {feature.description}
                  </p>

                  {/* Status */}
                  {feature.available ? (
                    <div className="inline-flex items-center bg-green-600/20 text-green-300 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium">
                      Available Now
                    </div>
                  ) : (
                    <div className="inline-flex items-center bg-yellow-500/20 text-yellow-300 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium">
                      Coming Soon
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="bg-night-800/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-primary-500/20">
            <div className="grid md:grid-cols-4 gap-4 sm:gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary-400 mb-1 sm:mb-2">100</div>
                <div className="text-gray-300">Messages Remaining</div>
                <div className="text-gray-400 text-sm mt-1">Free tier limit</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1 sm:mb-2">2</div>
                <div className="text-gray-300">Voice Calls Left</div>
                <div className="text-gray-400 text-sm mt-1">Free tier limit</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">2</div>
                <div className="text-gray-300">Scheduled Calls</div>
                <div className="text-gray-400 text-sm mt-1">Free tier limit</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">3</div>
                <div className="text-gray-300">Languages</div>
                <div className="text-gray-400 text-sm mt-1">English, Hindi, Gujarati</div>
              </div>
            </div>
          </div>

          {/* Settings Hint */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-gray-400 text-sm">
              Want to change your buddy's name? You can do that in the chat settings.
            </p>
          </div>
        </main>

        {/* Coming Soon Modal */}
        {selectedFeature && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-night-800 rounded-3xl p-6 sm:p-8 border border-primary-500/20 max-w-md w-full text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Coming Soon!</h3>
              <p className="text-gray-300 mb-4 sm:mb-6">
                This feature is currently in development. We'll notify you when it's ready!
              </p>
              <button
                onClick={() => setSelectedFeature(null)}
                className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FeatureSelectionPage;