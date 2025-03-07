import React, { useState } from 'react';

const CreateProject = ({ onClose, onSave }) => {
  const [projectName, setProjectName] = useState('');
  const [tickers, setTickers] = useState(['']);
  const [collaborators, setCollaborators] = useState([]);
  const [errors, setErrors] = useState({});

  const handleTickerChange = (index, value) => {
    const newTickers = [...tickers];
    newTickers[index] = value.toUpperCase();
    setTickers(newTickers);
  };

  const addTickerField = () => {
    setTickers([...tickers, '']);
  };

  const removeTickerField = (index) => {
    if (tickers.length > 1) {
      const newTickers = [...tickers];
      newTickers.splice(index, 1);
      setTickers(newTickers);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    
    const validTickers = tickers.filter(ticker => ticker.trim());
    if (validTickers.length === 0) {
      newErrors.tickers = 'At least one ticker is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const validTickers = tickers.filter(ticker => ticker.trim());
      onSave({
        name: projectName,
        tickers: validTickers,
        collaborators,
        createdAt: new Date().toISOString(),
        lastUpdated: 'Just now',
        progress: 0
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input 
                type="text" 
                id="projectName" 
                className={`input w-full ${errors.projectName ? 'border-red-500' : ''}`}
                placeholder="Enter project name" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tickers</label>
              {errors.tickers && (
                <p className="mt-1 text-sm text-red-600 mb-2">{errors.tickers}</p>
              )}
              
              {tickers.map((ticker, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input 
                    type="text" 
                    className="input flex-grow"
                    placeholder="Enter ticker symbol (e.g., AAPL)"
                    value={ticker}
                    onChange={(e) => handleTickerChange(index, e.target.value)}
                  />
                  <button 
                    type="button"
                    className="ml-2 text-gray-500 hover:text-red-500"
                    onClick={() => removeTickerField(index)}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <button 
                type="button"
                className="flex items-center text-sm text-primary font-medium mt-2"
                onClick={addTickerField}
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Ticker
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Collaborators</label>
                <button 
                  type="button"
                  className="text-xs text-primary font-medium flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Invite Collaborator
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">
                  No collaborators added yet. Use the invite button to add team members.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium text-gray-700 mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Financial data will be automatically retrieved from CapIQ for each ticker
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Expert calls will be fetched from AlphaSense
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  You can start collaborating with your team on analysis
                </li>
              </ul>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject; 