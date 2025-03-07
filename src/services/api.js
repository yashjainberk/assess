import axios from 'axios';
import {
  generateFinancialData,
  generateLiveMarketData,
  generateAnalystRatings,
  generatePeerComparison,
  generateNews,
  generateExpertCalls,
  generateDocuments
} from './mockData';

// Environment variables for controlling behavior
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';
const SIMULATE_API_DELAY = process.env.NODE_ENV === 'development' ? true : false;

// Configure API clients with proxied endpoints
const capiqClient = axios.create({
  baseURL: '/api/capiq',
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_CAPIQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const alphaSenseClient = axios.create({
  baseURL: '/api/alphasense',
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_ALPHASENSE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Helper function to simulate API delay in development
const simulateDelay = async () => {
  if (SIMULATE_API_DELAY) {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  }
};

// Mock data for project management (only) since we don't have a backend
const mockProjects = [
  {
    id: '1',
    name: 'Merger Analysis',
    tickers: ['AAPL', 'MSFT'],
    collaborators: [
      { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' }
    ],
    createdAt: '2023-08-15T12:00:00Z',
    lastUpdated: '2 days ago',
    progress: 75
  },
  {
    id: '2',
    name: 'Quarterly Report',
    tickers: ['TSLA'],
    collaborators: [
      { id: '1', name: 'John Doe', email: 'john.doe@example.com' }
    ],
    createdAt: '2023-08-10T09:30:00Z',
    lastUpdated: '5 days ago',
    progress: 40
  },
  {
    id: '3',
    name: 'IPO Valuation',
    tickers: ['RIVN', 'LCID'],
    collaborators: [],
    createdAt: '2023-08-05T14:15:00Z',
    lastUpdated: '1 week ago',
    progress: 20
  }
];

const API = {
  // Project Management - keeping mock data for this part only
  getProjects: async () => {
    // return axios.get('/api/projects');
    return Promise.resolve({ data: mockProjects });
  },
  
  getProject: async (id) => {
    // return axios.get(`/api/projects/${id}`);
    const project = mockProjects.find(p => p.id === id);
    return Promise.resolve({ data: project });
  },
  
  createProject: async (projectData) => {
    // return axios.post('/api/projects', projectData);
    const newProject = {
      id: Math.random().toString(36).substr(2, 9),
      ...projectData
    };
    mockProjects.push(newProject);
    return Promise.resolve({ data: newProject });
  },
  
  updateProject: async (id, projectData) => {
    // return axios.put(`/api/projects/${id}`, projectData);
    const index = mockProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProjects[index] = { ...mockProjects[index], ...projectData };
      return Promise.resolve({ data: mockProjects[index] });
    }
    return Promise.reject(new Error('Project not found'));
  },
  
  deleteProject: async (id) => {
    // return axios.delete(`/api/projects/${id}`);
    const index = mockProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProjects.splice(index, 1);
      return Promise.resolve({ data: { success: true } });
    }
    return Promise.reject(new Error('Project not found'));
  },
  
  // CapIQ Integration - LIVE DATA with Mock Fallback
  getFinancialData: async (ticker) => {
    try {
      // If mock data is enabled, return that instead
      if (USE_MOCK_DATA) {
        await simulateDelay();
        return { data: generateFinancialData(ticker) };
      }
      
      // Real API call to CapIQ for financial data via proxy
      const response = await capiqClient.get(`/v1/companies/${ticker}/financials`);
      return response;
    } catch (error) {
      console.error(`Error fetching financial data from CapIQ for ${ticker}:`, error);
      
      // Fall back to mock data in case of error
      await simulateDelay();
      return { data: generateFinancialData(ticker) };
    }
  },
  
  getCapIQNews: async (ticker) => {
    try {
      // If mock data is enabled, return that instead
      if (USE_MOCK_DATA) {
        await simulateDelay();
        return { data: generateNews(ticker) };
      }
      
      // Real API call to CapIQ for news data via proxy
      const response = await capiqClient.get(`/v1/companies/${ticker}/news`, {
        params: {
          limit: 10,
          days: 30 // Last 30 days
        }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching news from CapIQ for ${ticker}:`, error);
      
      // Fall back to mock data in case of error
      await simulateDelay();
      return { data: generateNews(ticker) };
    }
  },
  
  getCapIQLiveMarketData: async (ticker) => {
    try {
      // If mock data is enabled, return that instead
      if (USE_MOCK_DATA) {
        await simulateDelay();
        return { data: generateLiveMarketData(ticker) };
      }
      
      // Real API call to CapIQ for live market data via proxy
      const response = await capiqClient.get(`/v1/companies/${ticker}/market-data/live`);
      return response;
    } catch (error) {
      console.error(`Error fetching live market data from CapIQ for ${ticker}:`, error);
      
      // Fall back to mock data in case of error
      await simulateDelay();
      return { data: generateLiveMarketData(ticker) };
    }
  },
  
  getCapIQAnalystRatings: async (ticker) => {
    try {
      // If mock data is enabled, return that instead
      if (USE_MOCK_DATA) {
        await simulateDelay();
        return { data: generateAnalystRatings(ticker) };
      }
      
      // Real API call to CapIQ for analyst ratings via proxy
      const response = await capiqClient.get(`/v1/companies/${ticker}/analyst-ratings`);
      return response;
    } catch (error) {
      console.error(`Error fetching analyst ratings from CapIQ for ${ticker}:`, error);
      
      // Fall back to mock data in case of error
      await simulateDelay();
      return { data: generateAnalystRatings(ticker) };
    }
  },
  
  getCapIQPeerComparison: async (ticker) => {
    try {
      // If mock data is enabled, return that instead
      if (USE_MOCK_DATA) {
        await simulateDelay();
        return { data: generatePeerComparison(ticker) };
      }
      
      // Real API call to CapIQ for peer comparison via proxy
      const response = await capiqClient.get(`/v1/companies/${ticker}/peers`);
      return response;
    } catch (error) {
      console.error(`Error fetching peer comparison from CapIQ for ${ticker}:`, error);
      
      // Fall back to mock data in case of error
      await simulateDelay();
      return { data: generatePeerComparison(ticker) };
    }
  },
  
  // AlphaSense Integration - LIVE DATA with Mock Fallback
  getExpertCalls: async (ticker) => {
    try {
      // If mock data is enabled, return that instead
      if (USE_MOCK_DATA) {
        await simulateDelay();
        return { data: generateExpertCalls(ticker) };
      }
      
      // Real API call to AlphaSense for expert calls via proxy
      const response = await alphaSenseClient.get(`/v1/expert-calls`, {
        params: {
          query: ticker,
          limit: 10
        }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching expert calls from AlphaSense for ${ticker}:`, error);
      
      // Fall back to mock data in case of error
      await simulateDelay();
      return { data: generateExpertCalls(ticker) };
    }
  },
  
  getAlphaSenseDocuments: async (ticker) => {
    try {
      // If mock data is enabled, return that instead
      if (USE_MOCK_DATA) {
        await simulateDelay();
        return { data: generateDocuments(ticker) };
      }
      
      // Real API call to AlphaSense for documents via proxy
      const response = await alphaSenseClient.get(`/v1/documents`, {
        params: {
          query: ticker,
          limit: 10,
          docTypes: 'FILING,RESEARCH'
        }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching documents from AlphaSense for ${ticker}:`, error);
      
      // Fall back to mock data in case of error
      await simulateDelay();
      return { data: generateDocuments(ticker) };
    }
  },
  
  // Collaboration
  addCollaborator: async (projectId, userData) => {
    // return axios.post(`/api/projects/${projectId}/collaborators`, userData);
    const project = mockProjects.find(p => p.id === projectId);
    if (project) {
      const newCollaborator = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData
      };
      project.collaborators.push(newCollaborator);
      return Promise.resolve({ data: newCollaborator });
    }
    return Promise.reject(new Error('Project not found'));
  },
  
  removeCollaborator: async (projectId, collaboratorId) => {
    // return axios.delete(`/api/projects/${projectId}/collaborators/${collaboratorId}`);
    const project = mockProjects.find(p => p.id === projectId);
    if (project) {
      const index = project.collaborators.findIndex(c => c.id === collaboratorId);
      if (index !== -1) {
        project.collaborators.splice(index, 1);
        return Promise.resolve({ data: { success: true } });
      }
      return Promise.reject(new Error('Collaborator not found'));
    }
    return Promise.reject(new Error('Project not found'));
  }
};

export default API; 