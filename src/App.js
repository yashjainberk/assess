import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import CreateProject from './components/CreateProject';
import ProjectDetails from './components/ProjectDetails';
import API from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Load projects when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects();
    }
  }, [isLoggedIn]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await API.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    // In a real app, this would verify credentials via API
    setUser({ name: userData.email.split('@')[0], email: userData.email });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleSaveProject = async (projectData) => {
    try {
      setLoading(true);
      const response = await API.createProject(projectData);
      setProjects([...projects, response.data]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={handleLogout} 
        userName={user?.name}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
          </div>
        )}

        {!isLoggedIn ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <div>
            {!selectedProject && (
              <>
                {/* Projects Dashboard */}
                <Dashboard 
                  projects={projects} 
                  onCreateProject={handleCreateProject}
                  onViewProject={handleViewProject}
                />

                {/* Project Cards */}
                <section className="bg-white shadow-sm rounded-lg p-6 mt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">All Projects</h2>
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.map((project) => (
                        <div 
                          key={project.id} 
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewProject(project)}
                        >
                          <h3 className="font-medium text-gray-800">{project.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">Last updated: {project.lastUpdated}</p>
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {project.tickers.map((ticker, index) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                >
                                  {ticker}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex -space-x-2 overflow-hidden">
                              {project.collaborators.slice(0, 3).map((collaborator, index) => (
                                <div 
                                  key={index}
                                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white text-xs bg-gray-300 flex items-center justify-center"
                                  title={collaborator.name}
                                >
                                  {collaborator.name.charAt(0).toUpperCase()}
                                </div>
                              ))}
                              {project.collaborators.length > 3 && (
                                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white text-xs bg-gray-500 text-white flex items-center justify-center">
                                  +{project.collaborators.length - 3}
                                </div>
                              )}
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-500 rounded">
                              {project.progress}% Complete
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No projects found. Create your first project to get started.</p>
                      <button 
                        className="btn btn-primary mt-4"
                        onClick={handleCreateProject}
                      >
                        Create New Project
                      </button>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <CreateProject 
            onClose={() => setShowCreateModal(false)} 
            onSave={handleSaveProject} 
          />
        )}
      </main>

      {/* Project Details - Full Screen when selected */}
      {selectedProject && (
        <ProjectDetails 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}

export default App;
