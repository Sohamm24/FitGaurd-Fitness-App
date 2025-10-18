import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, TrendingUp, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getCurrentPage = (): string => {
    const path = location.pathname;
    if (path.includes('/activities')) return 'activities';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/profile')) return 'profile';
    return 'activities';
  };

  const currentPage = getCurrentPage();

  const getGradient = () => {
    switch(currentPage) {
      case 'activities':
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500';
      case 'analytics':
        return 'bg-gradient-to-r from-blue-500 to-emerald-500';
      case 'profile':
        return 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500';
      default:
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500';
    }
  };

  return (
    <>
      <nav className="p-4 md:p-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent ${getGradient()}`}>
              Balex
            </h1>
            
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => navigate('/activities')}
                className="px-6 py-2 rounded-lg font-medium transition-all bg-black hover:bg-zinc-900"
              >
                <Activity className={`inline-block w-5 h-5 mr-2 ${
                  currentPage === 'activities' ? 'text-pink-500' : 'text-gray-400'
                }`} />
                <span className={currentPage === 'activities' 
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent font-bold'
                  : 'text-gray-400'
                }>
                  Activities
                </span>
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="px-6 py-2 rounded-lg font-medium transition-all bg-black hover:bg-zinc-900"
              >
                <TrendingUp className={`inline-block w-5 h-5 mr-2 ${
                  currentPage === 'analytics' ? 'text-emerald-500' : 'text-gray-400'
                }`} />
                <span className={currentPage === 'analytics'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent font-bold'
                  : 'text-gray-400'
                }>
                  Analytics
                </span>
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-6 py-2 rounded-lg font-medium transition-all bg-black hover:bg-zinc-900"
              >
                <User className={`inline-block w-5 h-5 mr-2 ${
                  currentPage === 'profile' ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <span className={currentPage === 'profile'
                  ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent font-bold'
                  : 'text-gray-400'
                }>
                  Profile
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 p-4 z-50">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={() => navigate('/activities')}
            className="flex-1 px-3 py-3 rounded-lg transition-all bg-black"
          >
            <div className="flex flex-col items-center gap-1">
              <Activity className={`w-5 h-5 ${
                currentPage === 'activities' ? 'text-pink-500' : 'text-gray-400'
              }`} />
              <span className={`text-xs ${
                currentPage === 'activities'
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent font-bold'
                  : 'text-gray-400'
              }`}>
                Activities
              </span>
            </div>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="flex-1 px-3 py-3 rounded-lg transition-all bg-black"
          >
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className={`w-5 h-5 ${
                currentPage === 'analytics' ? 'text-emerald-500' : 'text-gray-400'
              }`} />
              <span className={`text-xs ${
                currentPage === 'analytics'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent font-bold'
                  : 'text-gray-400'
              }`}>
                Analytics
              </span>
            </div>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 px-3 py-3 rounded-lg transition-all bg-black"
          >
            <div className="flex flex-col items-center gap-1">
              <User className={`w-5 h-5 ${
                currentPage === 'profile' ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <span className={`text-xs ${
                currentPage === 'profile'
                  ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent font-bold'
                  : 'text-gray-400'
              }`}>
                Profile
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;