import { useState } from 'react';
import { analysisService } from '../services/analysisService';

const PREDEFINED_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Product Manager',
  'UI/UX Designer',
  'Marketing Specialist',
  'Sales Executive',
];

interface JobMatchToolProps {
  analysisId: string;
}

export default function JobMatchTool({ analysisId }: JobMatchToolProps) {
  const [matchType, setMatchType] = useState<'role' | 'jd'>('role');
  const [targetRole, setTargetRole] = useState(PREDEFINED_ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const finalRole = matchType === 'role' 
        ? (targetRole === 'Other' ? customRole : targetRole) 
        : undefined;
      
      const matchResult = await analysisService.generateMatch(
        analysisId,
        finalRole,
        matchType === 'jd' ? jobDescription : undefined
      );
      setResult(matchResult);
    } catch (err: any) {
      setError(err.message || 'Failed to generate ATS Match.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-4">ATS Job Match Simulator</h3>
      
      {!result ? (
        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setMatchType('role')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${matchType === 'role' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Select Target Role
            </button>
            <button
              onClick={() => setMatchType('jd')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${matchType === 'jd' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Paste Job Description
            </button>
          </div>

          {matchType === 'role' ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Choose an Industry Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {PREDEFINED_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
                <option value="Other">Other (Type custom role)</option>
              </select>
              
              {targetRole === 'Other' && (
                <input
                  type="text"
                  placeholder="e.g. Senior DevOps Engineer"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mt-2"
                />
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Paste Full Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the requirements and responsibilities here..."
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={isLoading || (matchType === 'jd' && !jobDescription) || (matchType === 'role' && targetRole === 'Other' && !customRole)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold disabled:bg-blue-300 transition-colors flex justify-center items-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Fit...
              </>
            ) : (
              'Calculate ATS Match Score'
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg text-gray-800">
              Match Results for: <span className="text-blue-600">{result.targetRole || 'Custom Job Description'}</span>
            </h4>
            <button 
              onClick={() => setResult(null)}
              className="text-sm text-gray-500 hover:text-gray-800 underline"
            >
              Test Another
            </button>
          </div>
          
          <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-lg">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${result.matchScore > 80 ? 'text-green-500' : result.matchScore > 50 ? 'text-yellow-500' : 'text-red-500'}`}
                  strokeDasharray={`${result.matchScore}, 100`}
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold">{result.matchScore}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-700">
                {result.matchScore >= 80 
                  ? 'Excellent fit! Your resume highly matches the requirements.' 
                  : result.matchScore >= 50 
                  ? 'Moderate fit. You have potential, but need to bridge some keyword gaps.' 
                  : 'Low fit. Significant restructuring and keyword optimization required.'}
              </p>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Missing ATS Keywords</h5>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.length > 0 ? result.missingKeywords.map((kw: string) => (
                <span key={kw} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  {kw}
                </span>
              )) : (
                <span className="text-green-600 font-medium">No major keywords missing!</span>
              )}
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Tailored Suggestions</h5>
            <ul className="space-y-2">
              {result.tailoredSuggestions.map((sug: string, i: number) => (
                <li key={i} className="flex gap-2 items-start text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5">•</span> {sug}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
