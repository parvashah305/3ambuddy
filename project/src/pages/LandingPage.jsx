import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import About from '../components/About';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-night-900">
      <Navigation />
      <Hero />
      <About />
      <Features />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;