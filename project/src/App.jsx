import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  useUser,
  useAuth
} from '@clerk/clerk-react';

import LandingPage from './pages/LandingPage';
import FeatureSelectionPage from './pages/FeatureSelectionPage';
import ChatPage from './pages/ChatPage';
import VoiceCallPage from './pages/VoiceCallPage';
import ScheduleCallPage from './pages/ScheduleCallPage';

import './App.css';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null; // or a loading spinner
  return isSignedIn ? children : <Navigate to="/" replace />;
}

function HomeRoute() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/features" replace />;
  }
  
  return <LandingPage />;
}

function App() {
  const { user, isSignedIn } = useUser();

  return (
    <Router>
      <div className="min-h-screen bg-night-900">
        <Routes>
          <Route path="/" element={<HomeRoute />} />

         
          <Route
            path="/features"
            element={
              <ProtectedRoute>
                <FeatureSelectionPage user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voice-call"
            element={
              <ProtectedRoute>
                <VoiceCallPage user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule-call"
            element={
              <ProtectedRoute>
                <ScheduleCallPage user={user} />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;