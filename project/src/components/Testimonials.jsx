import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya S.",
      age: "19",
      location: "Mumbai",
      rating: 5,
      text: "3 am Buddy has been my lifesaver during exam stress. Being able to chat in Hindi made it feel so much more personal and comforting.",
      highlight: "Lifesaver during exam stress"
    },
    {
      name: "Alex M.",
      age: "17",
      location: "Delhi",
      rating: 5,
      text: "I love the scheduled call feature. My AI buddy calls me every night at 10 PM to check in. It's like having a caring friend who never forgets.",
      highlight: "Like having a caring friend"
    },
    {
      name: "રીતિકા P.",
      age: "18",
      location: "Ahmedabad",
      rating: 5,
      text: "Speaking in Gujarati with my AI buddy feels so natural. It understands my cultural context and never judges. Perfect for late-night thoughts.",
      highlight: "Understands cultural context"
    },
    {
      name: "Arjun K.",
      age: "20",
      location: "Bangalore",
      rating: 5,
      text: "The voice calls are amazing! Sometimes texting isn't enough, and being able to actually talk through my problems helps so much more.",
      highlight: "Voice calls are amazing"
    },
    {
      name: "Sneha R.",
      age: "16",
      location: "Pune",
      rating: 5,
      text: "I was skeptical at first, but 3 am Buddy really gets it. It's helped me through panic attacks and lonely nights. Truly grateful.",
      highlight: "Helped through panic attacks"
    },
    {
      name: "Dev P.",
      age: "21",
      location: "Surat",
      rating: 5,
      text: "As someone who struggles with social anxiety, having an AI buddy who's patient and understanding has boosted my confidence so much.",
      highlight: "Boosted my confidence"
    }
  ];

  return (
    <section id="testimonials" className="bg-night-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            Hear from the Buddys
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real stories from young people who found comfort, support, and friendship 
            with their AI companion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-night-700/50 to-primary-900/20 backdrop-blur-sm rounded-2xl p-6 border border-primary-500/20 hover:border-primary-400/40 transition-all duration-300 transform hover:scale-105"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary-400 mb-4 opacity-60" />
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Highlight */}
              <div className="bg-primary-600/20 rounded-lg px-3 py-2 mb-4">
                <p className="text-primary-300 text-sm font-medium">
                  💝 {testimonial.highlight}
                </p>
              </div>

              {/* User Info */}
              <div className="border-t border-primary-500/20 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Age {testimonial.age}, {testimonial.location}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-900/30 to-purple-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-primary-500/20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10k+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-300">Availability</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">3</div>
              <div className="text-gray-300">Languages</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-300">Private</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;