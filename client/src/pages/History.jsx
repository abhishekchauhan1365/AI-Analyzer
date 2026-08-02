import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiEye, FiClock } from 'react-icons/fi';
import api from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/resume/history');
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await api.delete(`/resume/${id}`);
        setHistory(history.filter(h => h._id !== id));
      } catch (err) {
        console.error('Failed to delete');
      }
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-dark-border rounded w-1/4 mb-6"></div>
      {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-dark-border rounded-xl"></div>)}
    </div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analysis History</h1>

      {history.length === 0 ? (
        <div className="card text-center py-12">
          <FiClock size={48} className="mx-auto text-gray-300 dark:text-dark-border mb-4" />
          <h3 className="text-xl font-medium mb-2">No history found</h3>
          <p className="text-gray-500 mb-6">You haven't analyzed any resumes yet.</p>
          <Link to="/upload" className="btn-primary">Upload Resume</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item, index) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-0 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow"
            >
              <div className={`w-full sm:w-24 flex items-center justify-center p-4 text-white font-bold text-xl ${
                item.atsScore?.overall >= 80 ? 'bg-green-500' :
                item.atsScore?.overall >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {item.atsScore?.overall || 0}%
              </div>
              
              <div className="flex-1 p-5 flex flex-col justify-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                  Target: {item.jobDescription.substring(0, 80)}...
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                    Matched: {item.matchedKeywords?.length || 0}
                  </span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-end space-x-2 bg-gray-50 dark:bg-dark-bg/50 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-dark-border">
                <Link to={`/analysis/${item._id}`} className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg transition-colors" title="View">
                  <FiEye size={20} />
                </Link>
                <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                  <FiTrash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
