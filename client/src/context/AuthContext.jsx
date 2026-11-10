import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClerkProvider, SignedIn, SignedOut, UserButton, SignIn, SignUp, useUser, useClerk } from '@clerk/clerk-react';
import { HabrenoirLogo } from '../components/HabrenoirLogo';

const AuthContext = createContext();

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkAvailable = Boolean(
  CLERK_PUBLISHABLE_KEY &&
  CLERK_PUBLISHABLE_KEY.trim() !== '' &&
  CLERK_PUBLISHABLE_KEY.startsWith('pk_')
);

// Fallback Local Auth Provider for zero-friction demo / offline development
const LocalAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('habrenoir_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('habrenoir_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('habrenoir_auth_user');
      }
    } catch (e) {}
  }, [currentUser]);

  const loginAsVIP = () => {
    const user = {
      id: 'usr_vip_' + Date.now().toString(36),
      fullName: clientName.trim() || 'Nana Kwame Boateng',
      email: clientEmail.trim() || 'nana.boateng@luxury.gh',
      role: 'vip_client',
      title: 'VIP Client Ambassador',
      tier: 'VIP Client'
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setClientName('');
    setClientEmail('');
  };

  const loginAsAdmin = () => {
    const admin = {
      id: 'usr_admin_001',
      fullName: 'Brand Director',
      email: 'director@habrenoir.luxury',
      role: 'admin',
      title: 'Director of Leather Goods & Design',
      tier: 'Administrator'
    };
    setCurrentUser(admin);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    loginAsVIP();
  };

  return (
    <AuthContext.Provider
      value={{
        isClerkActive: false,
        user: currentUser,
        isSignedIn: Boolean(currentUser),
        isAdmin: currentUser?.role === 'admin',
        loginAsVIP,
        loginAsAdmin,
        logout,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAuthModalOpen
      }}
    >
      {children}

      {/* Customer VIP Private Salon Modal (No Admin Controls) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#111111]/60 backdrop-blur-xs"
            onClick={() => setIsAuthModalOpen(false)}
          />
          <div className="relative bg-[#FFFFFF] border border-[#E8E3DC] w-full max-w-md p-8 sm:p-10 z-10 rounded-none shadow-none text-center animate-fade-in font-sans">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-[#767676] hover:text-[#111111] p-2"
              aria-label="Close Auth Modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <HabrenoirLogo
              color="#3D0C15"
              className="w-12 h-12 mx-auto mb-3.5"
            />

            <span className="font-sans text-[10px] tracking-[0.28em] text-[#C5A880] uppercase block mb-2 font-medium">
              HABRENOIR · CLIENT PORTAL
            </span>
            <h3 className="font-serif text-[26px] tracking-tight text-[#111111] mb-2 font-normal">
              VIP Client Sign In
            </h3>
            <p className="font-sans text-[12px] text-[#767676] mb-6 leading-relaxed">
              Authenticate to access your curated private salon, track bespoke orders, and schedule confidential appointments.
            </p>

            <form onSubmit={handleClientSubmit} className="space-y-3.5 text-left text-[11px]">
              <div>
                <label className="block text-[#857374] uppercase tracking-wider mb-1">
                  Full Name / Salutation
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Nana Kwame Boateng"
                  className="w-full p-3 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[#111111] text-[12px]"
                />
              </div>

              <div>
                <label className="block text-[#857374] uppercase tracking-wider mb-1">
                  Email Address or Mobile Number
                </label>
                <input
                  type="text"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="e.g. client@domain.com or +233 24 419 8820"
                  className="w-full p-3 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[#111111] text-[12px]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[11px] tracking-[0.2em] uppercase hover:bg-[#140002] transition-colors border border-[#3D0C15] font-medium"
                >
                  Enter Private Salon
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E8E3DC] text-[10px] text-[#857374] tracking-normal font-sans">
              <span>Encrypted client session · White-glove concierge protection</span>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Clerk-Powered Auth Provider Bridge
const ClerkBridgeProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();

  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.primaryEmailAddress?.emailAddress?.includes('admin');

  return (
    <AuthContext.Provider
      value={{
        isClerkActive: true,
        user: isSignedIn
          ? {
              id: user.id,
              fullName: user.fullName || user.firstName || 'VIP Client',
              email: user.primaryEmailAddress?.emailAddress,
              role: isAdmin ? 'admin' : 'vip_client',
              imageUrl: user.imageUrl
            }
          : null,
        isSignedIn: Boolean(isSignedIn),
        isAdmin: Boolean(isAdmin),
        logout: () => signOut(),
        openAuthModal: () => openSignIn(),
        closeAuthModal: () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  if (isClerkAvailable) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ClerkBridgeProvider>{children}</ClerkBridgeProvider>
      </ClerkProvider>
    );
  }

  return <LocalAuthProvider>{children}</LocalAuthProvider>;
};

export const useAuth = () => useContext(AuthContext);
