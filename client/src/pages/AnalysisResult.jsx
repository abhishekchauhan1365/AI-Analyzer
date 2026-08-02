import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { FiCheckCircle, FiXCircle, FiInfo, FiDownload, FiArrowLeft } from 'react-icons/fi';
import api from '../services/api';

const COLORS = ['#0ea5e9', '#e2e8f0']; // Primary and Gray
const DARK_COLORS = ['#0ea5e9', '#334155'];

const CircularProgress = ({ score, title }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={60}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={isDarkMode ? DARK_COLORS[index] : COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold">{score}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">{title}</p>
    </div>
  );
};

const KeywordBadge = ({ text, type = 'default' }) => {
  const styles = {
    match: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800",
    missing: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800",
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[type]}`}>
      {text}
    </span>
  );
};

const AnalysisResult = () => {
  const location = useLocation();
  const { id } = useParams();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);

  useEffect(() => {
    if (!result && id) {
      // Fetch result if not passed via state (e.g., page refresh or direct link)
      // For simplicity, we just use the history endpoint here and find it
      const fetchResult = async () => {
        try {
          const { data } = await api.get('/resume/history');
          const found = data.find(r => r._id === id);
          if (found) setResult(found);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchResult();
    }
  }, [id, result]);

  if (loading) return <div className="text-center py-20 animate-pulse">Loading analysis...</div>;
  if (!result) return <div className="text-center py-20 text-red-500">Analysis not found.</div>;

  const { atsScore, matchedKeywords, missingKeywords, aiSuggestions, summary, coverLetter } = result;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <Link to="/history" className="flex items-center text-gray-500 hover:text-primary-500 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to History
        </Link>
        <div className="space-x-3">
          <button className="btn-secondary" onClick={() => window.print()}>
            <FiDownload className="inline mr-2" /> PDF Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scores */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div className="card text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500"></div>
            <h2 className="text-xl font-bold mb-6">Overall ATS Score</h2>
            <div className="flex justify-center mb-6">
              <CircularProgress score={atsScore?.overall || 0} title="Overall Match" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
              {atsScore?.overall >= 80 ? 'Excellent match! Your resume is highly tailored to this role.' : 
               atsScore?.overall >= 60 ? 'Good match, but there is room for improvement.' : 
               'Low match. Significant updates are recommended.'}
            </p>
          </motion.div>

          <motion.div className="card space-y-4">
            <h3 className="font-semibold text-lg border-b border-gray-100 dark:border-dark-border pb-2">Breakdown</h3>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Skills Match</span>
                <span className="font-medium">{atsScore?.skillsMatch || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${atsScore?.skillsMatch || 0}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Experience Match</span>
                <span className="font-medium">{atsScore?.experienceMatch || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${atsScore?.experienceMatch || 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Education Match</span>
                <span className="font-medium">{atsScore?.educationMatch || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${atsScore?.educationMatch || 0}%` }}></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FiCheckCircle className="text-green-500 mr-2" /> AI Review
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 bg-gray-50 dark:bg-dark-bg p-4 rounded-lg border border-gray-100 dark:border-dark-border">
              {aiSuggestions?.overallReview || 'No overall review available.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
                  <FiCheckCircle className="mr-2" /> Strong Points
                </h3>
                <ul className="space-y-2">
                  {aiSuggestions?.strongPoints?.map((pt, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2 mt-0.5">•</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center">
                  <FiXCircle className="mr-2" /> Weak Points
                </h3>
                <ul className="space-y-2">
                  {aiSuggestions?.weakPoints?.map((pt, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-red-500 mr-2 mt-0.5">•</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div className="card">
            <h2 className="text-xl font-bold mb-4">Keywords Analysis</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords?.length > 0 ? (
                  matchedKeywords.map((kw, i) => <KeywordBadge key={i} text={kw} type="match" />)
                ) : (
                  <span className="text-sm text-gray-500">No matched keywords found.</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Missing Keywords (Action Required)</h3>
              <div className="space-y-4">
                {missingKeywords && Object.entries(missingKeywords).map(([category, kws]) => (
                  kws && kws.length > 0 && (
                    <div key={category}>
                      <span className="text-xs font-medium text-gray-400 capitalize block mb-2">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <div className="flex flex-wrap gap-2">
                        {kws.map((kw, i) => <KeywordBadge key={i} text={kw} type="missing" />)}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </motion.div>

          {/* Generated Content */}
          <div className="grid grid-cols-1 gap-6">
            <motion.div className="card">
              <h2 className="text-xl font-bold mb-4">Generated Summary</h2>
              <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-lg border border-gray-100 dark:border-dark-border relative group">
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                  {summary || 'Summary not available.'}
                </p>
                <button 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 btn-secondary py-1 px-2 text-xs transition-opacity"
                  onClick={() => navigator.clipboard.writeText(summary)}
                >
                  Copy
                </button>
              </div>
            </motion.div>

            <motion.div className="card">
              <h2 className="text-xl font-bold mb-4">Generated Cover Letter</h2>
              <div className="bg-gray-50 dark:bg-dark-bg p-6 rounded-lg border border-gray-100 dark:border-dark-border relative group font-serif">
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {coverLetter || 'Cover letter not available.'}
                </p>
                <button 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 btn-secondary py-1 px-2 text-xs transition-opacity"
                  onClick={() => navigator.clipboard.writeText(coverLetter)}
                >
                  Copy
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
