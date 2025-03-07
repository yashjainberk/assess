import React from 'react';

const Header = ({ isLoggedIn, setIsLoggedIn, userName }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary">Assess</h1>
            </div>
            <nav className="ml-6 flex space-x-8">
              <a href="#" className="inline-flex items-center px-1 pt-1 border-b-2 border-primary text-sm font-medium">
                Dashboard
              </a>
              <a href="#" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Projects
              </a>
              <a href="#" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Analytics
              </a>
            </nav>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">{userName || 'User'}</span>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsLoggedIn(false)}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={() => setIsLoggedIn(true)}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 