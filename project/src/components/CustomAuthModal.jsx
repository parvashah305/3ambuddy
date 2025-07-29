import { useState, useEffect } from 'react';
import { X, Moon, Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useClerk, useSignIn, useSignUp } from '@clerk/clerk-react';

const CustomAuthModal = ({ isOpen, onClose, mode = 'signin' }) => {
  const [isSignIn, setIsSignIn] = useState(mode === 'signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [showToast, setShowToast] = useState(null);

  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();


  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignIn) {
        const result = await signIn.create({
          identifier: formData.email,
          password: formData.password,
        });

        if (result.status === 'complete') {
         
          setShowToast({ type: 'success', message: 'Login successful! Redirecting...' });
          window.location.href = '/features';
        } else {
          setError('Sign in failed. Please try again.');
          setShowToast({ type: 'error', message: 'Sign in failed. Please try again.' });
        }
      } else {
       
        const result = await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
          unsafeMetadata: {
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
        });

        if (result.status === 'complete') {
          
          setShowToast({ type: 'success', message: 'Sign up successful! Redirecting...' });
          window.location.href = '/features';
        } else if (result.status === 'missing_requirements') {
      
          await signUp.prepareEmailAddressVerification();
          setEmailSent(true);
          setError('');
        } else {
          setError('Sign up failed. Please try again.');
          setShowToast({ type: 'error', message: 'Sign up failed. Please try again.' });
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
      setShowToast({ type: 'error', message: err.message || 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });
      if (result.status === 'complete') {
        setShowToast({ type: 'success', message: 'Email verified! Redirecting...' });
        window.location.href = '/features';
      } else {
        setError('Verification failed. Please try again.');
        setShowToast({ type: 'error', message: 'Verification failed. Please try again.' });
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
      setShowToast({ type: 'error', message: err.message || 'Verification failed. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (error) setError('');
  };

  const handleToggleMode = () => {
    setIsSignIn(!isSignIn);
    setError('');
    setEmailSent(false);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    });
  };

  const handleResendEmail = async () => {
    try {
      setIsLoading(true);
      await signUp.prepareEmailAddressVerification();
      setError('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-night-800 to-night-900 border border-primary-500/20 rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Email Verification Success */}
          {emailSent && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
              <p className="text-gray-300 mb-6">
                We've sent a verification code to <span className="text-primary-400 font-medium">{formData.email}</span>
              </p>
              {/* Verification Code Input */}
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    className="w-full bg-night-700 border border-primary-500/30 text-white rounded-lg px-4 py-3 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-200"
                    placeholder="Enter code from email"
                    required
                    disabled={isVerifying}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isVerifying || !verificationCode}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>
              <div className="space-y-4 mt-4">
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  {isLoading ? 'Sending...' : 'Resend Code'}
                </button>
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setError('');
                    setVerificationCode('');
                  }}
                  className="w-full bg-night-700 hover:bg-night-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Back to Sign Up
                </button>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Already verified? <button onClick={() => window.location.href = '/features'} className="text-primary-400 hover:text-primary-300">Continue to App</button>
                </p>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Regular Auth Form */}
          {!emailSent && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Moon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isSignIn ? 'Welcome Back' : 'Join 3 am Buddy'}
                </h2>
                <p className="text-gray-300">
                  {isSignIn ? 'Sign in to continue your journey' : 'Create your account to get started'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isSignIn && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-night-700 border border-primary-500/30 text-white rounded-lg pl-10 pr-4 py-3 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-200"
                          placeholder="John"
                          required={!isSignIn}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-night-700 border border-primary-500/30 text-white rounded-lg pl-10 pr-4 py-3 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-200"
                          placeholder="Doe"
                          required={!isSignIn}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-night-700 border border-primary-500/30 text-white rounded-lg pl-10 pr-4 py-3 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-200"
                      placeholder="john@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-night-700 border border-primary-500/30 text-white rounded-lg pl-10 pr-12 py-3 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-200"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !signInLoaded || !signUpLoaded}
                  className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isSignIn ? 'Signing In...' : 'Creating Account...'}</span>
                    </div>
                  ) : (
                    isSignIn ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  {isSignIn ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={handleToggleMode}
                    disabled={isLoading}
                    className="text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSignIn ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary-500/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-night-800 text-gray-400">Or continue with</span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      setError('');
                      localStorage.setItem('showGoogleAuthToast', '1');
                      if (isSignIn) {
                        await signIn.authenticateWithRedirect({
                          strategy: 'oauth_google',
                          redirectUrl: '/features',
                          redirectUrlComplete: '/features'
                        });
                      } else {
                        await signUp.authenticateWithRedirect({
                          strategy: 'oauth_google',
                          redirectUrl: '/features',
                          redirectUrlComplete: '/features'
                        });
                      }
                    } catch (err) {
                      console.error('Google auth error:', err);
                      setError('Google authentication failed. Please try again.');
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading || !signInLoaded || !signUpLoaded}
                  className="w-full bg-night-700 border border-primary-500/30 text-white px-4 py-3 rounded-lg hover:bg-night-600 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Info about Google OAuth */}
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-xs">
                  {!isSignIn && "After signing up with Google, you can also sign in with email/password."}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomAuthModal; 