import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
      if (email.trim().toLowerCase() === 'media.ptmllc@gmail.com' && password === 'Quan@1993') {
        onLogin();
      } else {
        setError('Access Denied: Invalid credentials provided.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === 'media.ptmllc@gmail.com') {
        setResetSent(true);
      } else {
        setError('System Error: Email address not recognized in administrator database.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600"></div>

      <div className="w-full max-w-md bg-black/80 border border-red-900/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.15)] backdrop-blur-sm relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 text-red-500 mb-4 border border-red-800">
            {view === 'login' ? <Lock className="w-8 h-8" /> : <KeyRound className="w-8 h-8" />}
          </div>
          <h1 className="text-3xl font-bold text-white brand-font tracking-wider uppercase">
            Super<span className="text-red-500">Reactor</span> AI
          </h1>
          <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-2">
            Authorized Personnel Only
          </p>
        </div>

        {/* Login View */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Administrator Email"
                  className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
                  required
                />
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Access Key"
                  className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-900/50 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-red-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Authenticate <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            <div className="text-center">
                <button 
                    type="button"
                    onClick={() => { setView('forgot'); setError(''); }}
                    className="text-xs text-gray-500 hover:text-white transition-colors font-mono uppercase tracking-wide"
                >
                    Forgot Password?
                </button>
            </div>
          </form>
        )}

        {/* Forgot Password View */}
        {view === 'forgot' && (
          <div className="space-y-6">
             {!resetSent ? (
                 <form onSubmit={handleForgotPassword} className="space-y-6">
                    <p className="text-gray-400 text-sm text-center">
                        Enter your administrator email to receive a password reset link.
                    </p>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Administrator Email"
                        className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-gray-600"
                        required
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-900/50">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all border border-gray-700 hover:border-gray-500 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                    >
                        {isLoading ? 'Processing...' : 'Send Reset Link'}
                    </button>
                 </form>
             ) : (
                 <div className="text-center space-y-4 animate-fade-in">
                     <div className="w-16 h-16 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-800">
                         <Mail className="w-8 h-8" />
                     </div>
                     <h3 className="text-xl font-bold text-white">Check your inbox</h3>
                     <p className="text-gray-400 text-sm">
                         A password reset link has been sent to <br/>
                         <span className="text-white font-mono">{email}</span>
                     </p>
                 </div>
             )}

            <div className="text-center border-t border-gray-800 pt-4 mt-4">
                <button 
                    onClick={() => { 
                        setView('login'); 
                        setError(''); 
                        setResetSent(false);
                    }}
                    className="text-xs text-gray-500 hover:text-white transition-colors font-mono uppercase tracking-wide flex items-center justify-center gap-2 mx-auto"
                >
                   Back to Login
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;