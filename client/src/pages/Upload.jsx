import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import api from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5242880 // 5MB
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError('Please provide both a PDF resume and a job description.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const { data } = await api.post('/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/analysis/${data._id}`, { state: { result: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Upload Resume</h1>
        <p className="text-gray-500 dark:text-gray-400">Match your resume against a target job description.</p>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">1. Upload PDF Resume</h2>
          
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-300 ${
                isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-dark-border hover:border-primary-400 dark:hover:border-primary-500'
              }`}
            >
              <input {...getInputProps()} />
              <FiUploadCloud className="mx-auto text-4xl text-primary-500 mb-4" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">Drag & drop your PDF resume here</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">or click to browse files (Max 5MB)</p>
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-dark-border rounded-xl p-4 flex items-center justify-between bg-gray-50 dark:bg-dark-bg">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                  <FiFile size={24} />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setFile(null)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">2. Target Job Description</h2>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="input-field min-h-[200px] resize-y"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading || !file || !jobDescription}
            className={`btn-primary px-8 py-3 text-lg ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing AI...</span>
              </span>
            ) : 'Analyze Resume'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
