import { Heart, Shield, Globe } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="bg-night-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display animate-slide-in-bottom">
            Why 3 am Buddy?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-in-bottom" style={{animationDelay: '0.2s'}}>
            We understand that sometimes the hardest moments come at the quietest hours. 
            That's why we created your AI companion who's always there.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Story Content */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/20 animate-slide-in-left hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">Our Story</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                3 am Buddy was born from a simple understanding: mental health doesn't follow business hours. 
                Whether it's anxiety keeping you up, loneliness in the quiet hours, or just needing someone to talk to, 
                we're here.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Built specifically for youth, our AI companion understands the unique challenges of growing up 
                in today's world. We provide a safe, judgment-free space where you can express yourself freely.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-primary-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 animate-slide-in-left hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.2s'}}>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To ensure no young person ever feels alone, especially during those vulnerable late-night hours. 
                We combine cutting-edge AI technology with genuine care to create meaningful connections.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="space-y-6">
            <div className="text-center mb-8 animate-slide-in-right">
              <h3 className="text-3xl font-bold text-white mb-2">Our Values</h3>
              <p className="text-gray-400">What makes us different</p>
            </div>

            <div className="space-y-4">
              <div className="bg-night-700/50 backdrop-blur-sm rounded-xl p-6 border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300 animate-slide-in-right hover:scale-105" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center mb-3">
                  <Heart className="w-8 h-8 text-red-400 mr-3" />
                  <h4 className="text-xl font-semibold text-white">Empathy First</h4>
                </div>
                <p className="text-gray-300">
                  Every interaction is designed with compassion and understanding at its core.
                </p>
              </div>

              <div className="bg-night-700/50 backdrop-blur-sm rounded-xl p-6 border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300 animate-slide-in-right hover:scale-105" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center mb-3">
                  <Shield className="w-8 h-8 text-green-400 mr-3" />
                  <h4 className="text-xl font-semibold text-white">Privacy & Safety</h4>
                </div>
                <p className="text-gray-300">
                  Your conversations are private, secure, and never shared. Your trust is sacred to us.
                </p>
              </div>

              <div className="bg-night-700/50 backdrop-blur-sm rounded-xl p-6 border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300 animate-slide-in-right hover:scale-105" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center mb-3">
                  <Globe className="w-8 h-8 text-blue-400 mr-3" />
                  <h4 className="text-xl font-semibold text-white">Cultural Understanding</h4>
                </div>
                <p className="text-gray-300">
                  Supporting multiple languages and cultural contexts to serve diverse communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;