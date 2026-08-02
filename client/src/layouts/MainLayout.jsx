import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiUploadCloud, FiClock, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-border">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-indigo-500">Resume AI</span>
          <button className="lg:hidden" onClick={toggleSidebar}>
            <FiX size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors">
            <FiHome className="text-primary-500" />
            <span>Dashboard</span>
          </Link>
          <Link to="/upload" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors">
            <FiUploadCloud className="text-primary-500" />
            <span>Upload Resume</span>
          </Link>
          <Link to="/history" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors">
            <FiClock className="text-primary-500" />
            <span>History</span>
          </Link>
          <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors">
            <FiUser className="text-primary-500" />
            <span>Profile</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-dark-border">
          <button onClick={logout} className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border lg:hidden">
          <button onClick={toggleSidebar}>
            <FiMenu size={24} />
          </button>
          <span className="text-xl font-bold">Resume AI</span>
          <div className="w-6"></div> {/* Placeholder for centering */}
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
