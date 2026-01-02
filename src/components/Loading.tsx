import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-transparent to-emerald-100/30 animate-gradient-x"></div>
      
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTItLjktMi0yLTJ6bS0yOCAwaC0ydjJoMnYtMnpNNCAzOGgyVjM2SDR2MnpNMzYgNDJjLTEuMSAwLTIgLjktMiAycy45IDIgMiAyIDItLjkgMi0yLS45LTItMi0yek0xOSAxOGgydi0yaC0ydjJ6bTE0LTE0Yy0xLjEgMC0yIC45LTIgMnMuOSAyIDIgMiAyLS45IDItMi0uOS0yLTItMnoiIGZpbGw9IiMwMDciIG9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-400/20 to-emerald-400/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Loading Container */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full mx-4 border border-white/50">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
        
        <div className="relative flex flex-col items-center space-y-8">
          {/* Logo Container */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-emerald-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative">
              <img
                src="/rx.png"
                alt="Rx Logo"
                className="w-24 h-24 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 w-24 h-24 border-2 border-blue-300/30 rounded-full animate-ping opacity-40"></div>
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="relative w-full">
            <div className="relative h-2 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-emerald-500 rounded-full animate-loading-bar"></div>
            </div>
            <div className="absolute -right-2 -top-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Loading Your Prescriptions
              </h1>
              <p className="text-slate-600 mt-2 text-sm font-medium">
                Securely accessing your medical records...
              </p>
            </div>

            {/* Progress Status */}
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-slate-500">Authentication</span>
              </div>
              <div className="h-1 w-6 bg-gradient-to-r from-blue-300 to-emerald-300 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-slate-500">Data Retrieval</span>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            <span>End-to-end encrypted • HIPAA compliant</span>
          </div>
        </div>
      </div>

      {/* Animated Corner Accents */}
      <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-blue-300/30 rounded-tl-2xl animate-fade-in"></div>
      <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-emerald-300/30 rounded-tr-2xl animate-fade-in" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-blue-300/30 rounded-bl-2xl animate-fade-in" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-emerald-300/30 rounded-br-2xl animate-fade-in" style={{ animationDelay: '1.5s' }}></div>

      {/* Add custom animations to your global CSS or Tailwind config */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-50%); }
          50% { transform: translateX(50%); }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.1); }
        }
        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}