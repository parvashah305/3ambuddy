import { MessageCircle, Phone, Clock } from 'lucide-react';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-night-900 via-primary-900 to-night-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary-300 rounded-full animate-twinkle"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-48 left-1/4 w-1.5 h-1.5 bg-primary-200 rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-40 left-1/6 w-2 h-2 bg-primary-400 rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{animationDelay: '0.8s'}}></div>
        
        {/* Floating Moon */}
        <div className="absolute top-16 right-16 w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full animate-float opacity-80 hidden lg:block"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          {/* Digital Clock Display */}
          <div className="mb-8 inline-flex items-center bg-night-800/50 backdrop-blur-sm rounded-2xl px-6 py-3 border border-primary-500/20 animate-scale-in">
            <Clock className="w-6 h-6 text-primary-400 mr-3" />
            <span className="text-3xl md:text-4xl font-mono text-primary-300 font-bold">3:00 AM</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-display leading-tight animate-slide-in-bottom">
            Your AI Buddy,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
              Anytime
            </span>
            <br />
            Even at 3 AM
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-in-bottom" style={{animationDelay: '0.2s'}}>
            Talk, Call, or Get a Call — in{' '}
            <span className="text-primary-400 font-semibold">English</span>,{' '}
            <span className="text-primary-400 font-semibold">Hindi</span> or{' '}
            <span className="text-primary-400 font-semibold">Gujarati</span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-in-bottom" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center bg-primary-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-500/30 hover:scale-105 transition-transform duration-300">
              <MessageCircle className="w-5 h-5 text-primary-400 mr-2" />
              <span className="text-primary-200">24/7 Chat</span>
            </div>
            <div className="flex items-center bg-primary-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-500/30 hover:scale-105 transition-transform duration-300">
              <Phone className="w-5 h-5 text-primary-400 mr-2" />
              <span className="text-primary-200">Voice Calls</span>
            </div>
            <div className="flex items-center bg-primary-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-500/30 hover:scale-105 transition-transform duration-300">
              <Clock className="w-5 h-5 text-primary-400 mr-2" />
              <span className="text-primary-200">Scheduled Calls</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-in-bottom" style={{animationDelay: '0.6s'}}>
            <button 
              onClick={() => scrollToSection('features')}
              className="group bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-primary-500/25"
            >
              Start Talking
              <MessageCircle className="inline-block w-5 h-5 ml-2 group-hover:animate-pulse" />
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-primary-300 hover:text-white border border-primary-500/50 hover:border-primary-400 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Learn More
            </button>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 text-center animate-fade-in" style={{animationDelay: '0.8s'}}>
            <p className="text-gray-400 text-sm mb-2">Trusted by thousands of users worldwide</p>
            <div className="flex justify-center items-center space-x-6 text-gray-500">
              <div className="text-xs">🔒 100% Private</div>
              <div className="text-xs">🛡️ Secure</div>
              <div className="text-xs">🌍 Multilingual</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;