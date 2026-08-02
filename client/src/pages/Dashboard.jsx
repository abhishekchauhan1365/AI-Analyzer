import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFileText, FiUpload, FiTrendingUp, FiStar } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/resume/history');
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getChartData = () => {
    return [...history].reverse().map(h => ({
      date: new Date(h.createdAt).toLocaleDateString(),
      score: h.atsScore?.overall || 0
    }));
  };

  const avgScore = history.length ? Math.round(history.reduce((acc, h) => acc + (h.atsScore?.overall || 0), 0) / history.length) : 0;
  const topScore = history.length ? Math.max(...history.map(h => h.atsScore?.overall || 0)) : 0;

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-dark-border rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-dark-border rounded-xl"></div>)}
      </div>
      <div className="h-64 bg-gray-200 dark:bg-dark-border rounded-xl"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/upload" className="btn-primary flex items-center space-x-2">
          <FiUpload /> <span>New Analysis</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card flex items-center space-x-4 border-l-4 border-primary-500">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-500">
            <FiFileText size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Analyses</p>
            <p className="text-2xl font-bold">{history.length}</p>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="card flex items-center space-x-4 border-l-4 border-indigo-500">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-500">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Average ATS Score</p>
            <p className="text-2xl font-bold">{avgScore}%</p>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="card flex items-center space-x-4 border-l-4 border-green-500">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-full text-green-500">
            <FiStar size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Highest Score</p>
            <p className="text-2xl font-bold">{topScore}%</p>
          </div>
        </motion.div>
      </div>

      {history.length > 0 ? (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="card">
          <h2 className="text-lg font-semibold mb-4">ATS Score Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ) : (
        <div className="card text-center py-12">
          <FiFileText size={48} className="mx-auto text-gray-300 dark:text-dark-border mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No analyses yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Upload your first resume and job description to get started.</p>
          <Link to="/upload" className="btn-primary">Analyze Resume</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
