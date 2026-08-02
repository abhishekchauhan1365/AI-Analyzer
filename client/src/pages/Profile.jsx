import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiMoon, FiSun } from 'react-icons/fi';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100 dark:border-dark-border">
          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <FiMail className="mr-2" /> {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Preferences</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-100 dark:border-dark-border">
              <div>
                <p className="font-medium flex items-center">
                  {darkMode ? <FiMoon className="mr-2 text-indigo-400" /> : <FiSun className="mr-2 text-yellow-500" />} 
                  Theme Appearance
                </p>
                <p className="text-sm text-gray-500 mt-1">Switch between light and dark mode</p>
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${darkMode ? 'bg-primary-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
