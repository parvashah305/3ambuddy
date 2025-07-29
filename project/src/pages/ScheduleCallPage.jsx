import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Moon, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  CreditCard,
  Edit3,
  Check,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

const ScheduleCallPage = ({ user }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newBuddyName, setNewBuddyName] = useState('Buddy');
  const [buddyName, setBuddyName] = useState('Buddy');
  const [scheduledCallsRemaining, setScheduledCallsRemaining] = useState(2);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [scheduledCalls, setScheduledCalls] = useState([]);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    isRecurring: false,
    recurringDays: [],
    recurringTime: ''
  });

  const navigate = useNavigate();

  const packages = [
    { id: 1, calls: 5, price: 49, popular: false },
    { id: 2, calls: 10, price: 79, popular: true },
    { id: 3, calls: 20, price: 129, popular: false }
  ];

  const daysOfWeek = [
    { id: 'mon', label: 'Mon', full: 'Monday' },
    { id: 'tue', label: 'Tue', full: 'Tuesday' },
    { id: 'wed', label: 'Wed', full: 'Wednesday' },
    { id: 'thu', label: 'Thu', full: 'Thursday' },
    { id: 'fri', label: 'Fri', full: 'Friday' },
    { id: 'sat', label: 'Sat', full: 'Saturday' },
    { id: 'sun', label: 'Sun', full: 'Sunday' }
  ];

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSaveBuddyName = () => {
    setBuddyName(newBuddyName);
    setIsEditingName(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayToggle = (dayId) => {
    setFormData(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(dayId)
        ? prev.recurringDays.filter(d => d !== dayId)
        : [...prev.recurringDays, dayId]
    }));
  };

  const handleScheduleCall = () => {
    if (scheduledCallsRemaining <= 0) {
      setShowToast({
        type: 'error',
        message: "Free scheduled call limit reached. Please top up to continue."
      });
      return;
    }

    if (formData.isRecurring) {
      if (formData.recurringDays.length === 0 || !formData.recurringTime) {
        setShowToast({
          type: 'error',
          message: "Please select days and time for recurring calls."
        });
        return;
      }

      const dayLabels = formData.recurringDays.map(dayId => 
        daysOfWeek.find(d => d.id === dayId)?.label
      ).join(', ');

      const newSchedule = {
        id: Date.now(),
        type: 'recurring',
        days: formData.recurringDays,
        time: formData.recurringTime,
        description: `${dayLabels} at ${formData.recurringTime}`
      };

      setScheduledCalls(prev => [...prev, newSchedule]);
      setScheduledCallsRemaining(prev => prev - 1);
      
      setShowToast({
        type: 'success',
        message: `Recurring calls scheduled on ${dayLabels} at ${formData.recurringTime}.`
      });

      // Reset form
      setFormData({
        date: '',
        time: '',
        isRecurring: false,
        recurringDays: [],
        recurringTime: ''
      });
    } else {
      if (!formData.date || !formData.time) {
        setShowToast({
          type: 'error',
          message: "Please select both date and time for the call."
        });
        return;
      }

      const selectedDate = new Date(formData.date);
      const formattedDate = selectedDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
      });

      const newSchedule = {
        id: Date.now(),
        type: 'one-time',
        date: formData.date,
        time: formData.time,
        description: `${formattedDate} at ${formData.time}`
      };

      setScheduledCalls(prev => [...prev, newSchedule]);
      setScheduledCallsRemaining(prev => prev - 1);
      
      setShowToast({
        type: 'success',
        message: `Call scheduled for ${formattedDate}, ${formData.time}.`
      });

      // Reset form
      setFormData({
        date: '',
        time: '',
        isRecurring: false,
        recurringDays: [],
        recurringTime: ''
      });
    }
  };

  const handleDeleteSchedule = (scheduleId) => {
    setScheduledCalls(prev => prev.filter(s => s.id !== scheduleId));
    setScheduledCallsRemaining(prev => prev + 1);
    setShowToast({
      type: 'success',
      message: 'Scheduled call removed successfully.'
    });
  };

  const handleTopUp = (packageItem) => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        setScheduledCallsRemaining(prev => prev + packageItem.calls);
        setShowTopUpModal(false);
        setShowToast({
          type: 'success',
          message: `Top-up successful! You now have ${scheduledCallsRemaining + packageItem.calls} additional scheduled calls.`
        });
      } else {
        setShowToast({
          type: 'error',
          message: 'Payment failed. Please try again.'
        });
      }
      setIsProcessingPayment(false);
    }, 2000);
  };

  // Get today's date for min date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-900 to-night-800">
      {/* Header */}
      <header className="bg-night-900/95 backdrop-blur-md border-b border-primary-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/features')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-2">
                <Moon className="w-8 h-8 text-primary-400" />
                <span className="text-2xl font-bold text-white font-display">3 am Buddy</span>
              </div>
            </div>

            {/* Right Side */}
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Buddy Name Section */}
        <div className="bg-night-800/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-primary-500/20 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white">Schedule Calls with</h2>
                {isEditingName ? (
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      value={newBuddyName}
                      onChange={(e) => setNewBuddyName(e.target.value)}
                      className="w-full px-3 py-2 bg-night-700 border border-primary-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200 text-sm sm:text-base"
                      placeholder="Enter buddy name"
                    />
                    <div className="flex space-x-2">
                    <button
                      onClick={handleSaveBuddyName}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                        <Check className="w-4 h-4 mr-1" />
                        Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setNewBuddyName(buddyName);
                      }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                    </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary-300 text-base sm:text-lg font-semibold truncate">{buddyName}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-primary-400 hover:text-primary-300 transition-colors duration-200 p-2 ml-2"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Schedule Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* New Schedule Form */}
            <div className="bg-night-800/50 backdrop-blur-sm rounded-3xl p-8 border border-primary-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Schedule New Call</h3>
              
              {/* Call Counter */}
              <div className="mb-6">
                <div className="inline-flex items-center bg-primary-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-500/30">
                  <Calendar className="w-5 h-5 text-primary-400 mr-2" />
                  <span className="text-primary-200">
                    You have <span className="text-white font-bold">{scheduledCallsRemaining}</span> free scheduled calls remaining
                  </span>
                </div>
              </div>

              {/* Schedule Type Toggle */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleType"
                      checked={!formData.isRecurring}
                      onChange={() => setFormData(prev => ({ ...prev, isRecurring: false }))}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
                      !formData.isRecurring 
                        ? 'border-primary-400 bg-primary-400' 
                        : 'border-gray-400'
                    }`}>
                      {!formData.isRecurring && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="text-white">One-time Call</span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleType"
                      checked={formData.isRecurring}
                      onChange={() => setFormData(prev => ({ ...prev, isRecurring: true }))}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
                      formData.isRecurring 
                        ? 'border-primary-400 bg-primary-400' 
                        : 'border-gray-400'
                    }`}>
                      {formData.isRecurring && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="text-white">Recurring Calls</span>
                  </label>
                </div>
              </div>

              {/* One-time Schedule */}
              {!formData.isRecurring && (
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={today}
                      className="w-full px-4 py-3 bg-night-700/50 border border-primary-500/30 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Select Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-night-700/50 border border-primary-500/30 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Recurring Schedule */}
              {formData.isRecurring && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      Select Days
                    </label>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => handleDayToggle(day.id)}
                          className={`p-2 sm:p-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                            formData.recurringDays.includes(day.id)
                              ? 'bg-primary-600 text-white'
                              : 'bg-night-700/50 text-gray-300 hover:bg-night-600'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Select Time
                    </label>
                    <input
                      type="time"
                      name="recurringTime"
                      value={formData.recurringTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-night-700/50 border border-primary-500/30 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Schedule Button */}
              <button
                onClick={handleScheduleCall}
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center"
              >
                <Plus className="w-6 h-6 mr-3" />
                Schedule Call
              </button>

              {scheduledCallsRemaining <= 1 && (
                <p className="text-orange-400 text-sm mt-4 text-center">
                  ⚠️ You're running low on scheduled calls. Consider topping up!
                </p>
              )}
            </div>

            {/* Scheduled Calls List */}
            {scheduledCalls.length > 0 && (
              <div className="bg-night-800/50 backdrop-blur-sm rounded-3xl p-8 border border-primary-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Your Scheduled Calls</h3>
                <div className="space-y-4">
                  {scheduledCalls.map((schedule) => (
                    <div 
                      key={schedule.id}
                      className="bg-night-700/50 rounded-2xl p-4 border border-primary-500/20 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center">
                          {schedule.type === 'recurring' ? (
                            <Calendar className="w-5 h-5 text-primary-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-primary-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {schedule.type === 'recurring' ? 'Recurring Call' : 'One-time Call'}
                          </p>
                          <p className="text-gray-300 text-sm">{schedule.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top-Up Section */}
          <div className="bg-night-800/50 backdrop-blur-sm rounded-3xl p-8 border border-primary-500/20 h-fit">
            <div className="text-center mb-6">
              <CreditCard className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Top Up Scheduled Calls</h3>
              <p className="text-gray-300">Get more scheduled calls to stay connected with {buddyName}</p>
            </div>

            <div className="space-y-4">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`relative bg-night-700/50 rounded-2xl p-4 border transition-all duration-300 hover:scale-105 ${
                    pkg.popular 
                      ? 'border-primary-400/50 bg-gradient-to-r from-primary-900/20 to-purple-900/20' 
                      : 'border-primary-500/20 hover:border-primary-400/40'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{pkg.calls} Scheduled Calls</p>
                      <p className="text-gray-400 text-sm">₹{pkg.price}</p>
                    </div>
                    <button
                      onClick={() => handleTopUp(pkg)}
                      disabled={isProcessingPayment}
                      className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-sm"
                    >
                      {isProcessingPayment ? 'Processing...' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTopUpModal(true)}
              className="w-full mt-6 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              View All Packages
            </button>
          </div>
        </div>
      </main>

      {/* Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-night-800 rounded-3xl p-8 border border-primary-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Choose Your Package</h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`relative bg-night-700/50 rounded-2xl p-6 border transition-all duration-300 hover:scale-105 cursor-pointer ${
                    pkg.popular 
                      ? 'border-primary-400/50 bg-gradient-to-r from-primary-900/20 to-purple-900/20' 
                      : 'border-primary-500/20 hover:border-primary-400/40'
                  }`}
                  onClick={() => handleTopUp(pkg)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{pkg.calls}</div>
                    <div className="text-primary-300 mb-2">Scheduled Calls</div>
                    <div className="text-2xl font-bold text-primary-400 mb-4">₹{pkg.price}</div>
                    <div className="text-gray-400 text-sm">₹{(pkg.price / pkg.calls).toFixed(1)} per call</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Secure payment powered by industry-standard encryption
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
    </div>
  );
};

export default ScheduleCallPage;