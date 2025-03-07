import React from 'react';
import ProjectCard from './ProjectCard';

const Dashboard = ({ projects = [], onCreateProject, onViewProject }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <section className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Assess</h2>
        <p className="text-gray-600 mb-6">
          Your investment banking project management tool. Create projects, add tickers, fetch financial data, and collaborate with your team.
        </p>
        <button onClick={onCreateProject} className="btn btn-primary">Create New Project</button>
      </section>

      <section className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Projects</h2>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => onViewProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No projects found. Create your first project to get started.</p>
          </div>
        )}
      </section>

      <section className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Data Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Companies Tracked</h3>
            <p className="text-3xl font-bold text-primary">
              {projects.reduce((count, project) => count + project.tickers.length, 0)}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Expert Calls</h3>
            <p className="text-3xl font-bold text-secondary">
              {projects.length * 3} {/* Simplified for demo */}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-accent">{projects.length}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 