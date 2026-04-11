import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

// Demo credentials for when Firebase is NOT configured
// Change these to whatever you want for local dev
const DEMO_EMAIL = 'admin@delejaipur.com';
const DEMO_PASSWORD = 'admin123';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // If Firebase auth is not initialized (no credentials), skip real auth
    if (!auth) {
      setLoading(false);
      setDemoMode(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const demoLogin = (email, password) => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setUser({ email: DEMO_EMAIL, displayName: 'Admin (Demo)', uid: 'demo-admin' });
      return true;
    }
    return false;
  };

  const demoLogout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, demoMode, demoLogin, demoLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
