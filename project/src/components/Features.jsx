import { MessageCircle, Phone, Calendar, Shield, Zap, Globe } from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: MessageCircle,
      title: "24/7 Text Chat",
      description: "Your AI buddy is always ready to listen, chat, and support you through text messages anytime you need.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-900/30 to-cyan-900/30"
    },
    {
      icon: Phone,
      title: "Voice Call Support",
      description: "Have a real conversation with your AI buddy through voice calls for a more personal connection.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-900/30 to-emerald-900/30"
    },
    {
      icon: Calendar,
      title: "Scheduled AI Calls",
      description: "Set a time and your AI buddy will call you - perfect for regular check-ins or those 3 AM moments.",
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-900/30 to-violet-900/30"
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "100% Private & Secure",
      description: "Your conversations are encrypted and never shared"
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Get immediate support when you need it most"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Chat in English, Hindi, or Gujarati"
    }
  ];

  return (
    <section id="features" className="bg-gradient-to-br from-night-900 to-primary-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display animate-slide-in-bottom">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-in-bottom" style={{animationDelay: '0.2s'}}>
            Your AI companion comes packed with features designed to provide support, 
            comfort, and connection whenever you need it.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-br backdrop-blur-sm rounded-2xl p-8 border border-primary-500/20 hover:border-primary-400/40 transition-all duration-300 transform hover:scale-105 animate-slide-in-bottom"
              style={{
                backgroundImage: `linear-gradient(135deg, ${feature.bgColor})`,
                animationDelay: `${0.3 + index * 0.1}s`
              }}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-night-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-primary-500/20 animate-scale-in" style={{animationDelay: '0.6s'}}>
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Built for Your Peace of Mind
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center group animate-slide-in-bottom" style={{animationDelay: `${0.7 + index * 0.1}s`}}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600/20 border border-primary-500/30 mb-4 group-hover:bg-primary-600/30 transition-colors duration-300 group-hover:scale-110">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Language Support Highlight */}
        <div className="mt-16 text-center animate-fade-in" style={{animationDelay: '1s'}}>
          <div className="inline-flex flex-col sm:flex-row items-center bg-gradient-to-r from-primary-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl px-3 sm:px-8 py-3 sm:py-4 border border-primary-500/30 hover:scale-105 transition-transform duration-300 max-w-[95%] sm:max-w-full">
            <div className="flex items-center mb-2 sm:mb-0 sm:mr-3">
              <Globe className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400 mr-2 sm:mr-3" />
              <span className="text-xs sm:text-lg text-primary-200">Speak your language:</span>
            </div>
            <div className="flex flex-wrap justify-center sm:flex-nowrap space-x-1 sm:space-x-4">
              <span className="text-white font-semibold text-xs sm:text-base">English</span>
              <span className="text-primary-300 text-xs sm:text-base">•</span>
              <span className="text-white font-semibold text-xs sm:text-base">हिंदी</span>
              <span className="text-primary-300 text-xs sm:text-base">•</span>
              <span className="text-white font-semibold text-xs sm:text-base">ગુજરાતી</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;