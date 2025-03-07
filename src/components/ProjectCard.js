import React from 'react';

const ProjectCard = ({ project, onClick }) => {
  const { name, lastUpdated, tickers, collaborators } = project;
  
  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-medium text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">Last updated: {lastUpdated}</p>
      
      {tickers && tickers.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Tickers</p>
          <div className="flex flex-wrap gap-1">
            {tickers.map((ticker, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {ticker}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {collaborators && collaborators.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Collaborators</p>
          <div className="flex -space-x-2 overflow-hidden">
            {collaborators.map((collaborator, index) => (
              <div 
                key={index}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white text-xs bg-gray-300 flex items-center justify-center"
                title={collaborator.name}
              >
                {collaborator.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
        <button 
          className="text-sm text-primary hover:text-primary-dark font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Details
        </button>
        <div className="flex space-x-2">
          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-500 rounded">
            {project.progress || 0}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 