import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ProjectDetails = ({ project, onClose }) => {
  const [financialData, setFinancialData] = useState({});
  const [liveMarketData, setLiveMarketData] = useState({});
  const [peerComparison, setPeerComparison] = useState({});
  const [analystRatings, setAnalystRatings] = useState({});
  const [capiqNews, setCapiqNews] = useState({});
  const [expertCalls, setExpertCalls] = useState({});
  const [alphaSenseDocuments, setAlphaSenseDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Function to refresh data at intervals
  const setupLiveData = () => {
    // Clear any existing interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    
    // Set up new interval - refresh every 15 seconds for live data
    const interval = setInterval(() => {
      fetchLiveData(true);
      setLastUpdated(new Date());
    }, 15000);
    
    setRefreshInterval(interval);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  };

  useEffect(() => {
    // Initialize all data
    fetchData();
    
    // Set up live data refresh for market data only
    const cleanup = setupLiveData();
    
    return () => {
      cleanup();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [project.tickers]);

  // Fetch live market data only - called on interval
  const fetchLiveData = async (isRefresh = false) => {
    try {
      const liveDataPromises = project.tickers.map(async (ticker) => {
        try {
          const response = await API.getCapIQLiveMarketData(ticker);
          return {
            ticker,
            data: response.data
          };
        } catch (error) {
          console.error(`Error fetching live data for ${ticker}:`, error);
          return {
            ticker,
            error: error.message
          };
        }
      });
      
      const liveDataResults = await Promise.all(liveDataPromises);
      
      // Process results
      const liveDataByTicker = {};
      
      liveDataResults.forEach(result => {
        if (result.error) {
          liveDataByTicker[result.ticker] = { error: result.error };
        } else {
          liveDataByTicker[result.ticker] = result.data;
        }
      });
      
      setLiveMarketData(liveDataByTicker);
    } catch (error) {
      console.error('Error in live data refresh:', error);
      // We don't set the main error state here to avoid disrupting the UI during auto-refresh
    }
  };

  // Fetch all data - called once on component mount
  const fetchData = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Create an array of promises for all ticker data
      const dataPromises = project.tickers.map(async (ticker) => {
        try {
          // Perform parallel requests for each ticker
          const [
            financialResponse,
            liveMarketResponse,
            peerComparisonResponse,
            analystRatingsResponse,
            newsResponse,
            expertCallsResponse,
            documentsResponse
          ] = await Promise.all([
            API.getFinancialData(ticker),
            API.getCapIQLiveMarketData(ticker),
            API.getCapIQPeerComparison(ticker),
            API.getCapIQAnalystRatings(ticker),
            API.getCapIQNews(ticker),
            API.getExpertCalls(ticker),
            API.getAlphaSenseDocuments(ticker)
          ]);
          
          return {
            ticker,
            financialData: financialResponse.data,
            liveMarketData: liveMarketResponse.data,
            peerComparison: peerComparisonResponse.data,
            analystRatings: analystRatingsResponse.data,
            capiqNews: newsResponse.data,
            expertCalls: expertCallsResponse.data,
            alphaSenseDocuments: documentsResponse.data
          };
        } catch (error) {
          console.error(`Error fetching data for ${ticker}:`, error);
          // Return partial data with error information
          return {
            ticker,
            error: error.message
          };
        }
      });
      
      const results = await Promise.all(dataPromises);
      
      // Check if all requests failed
      if (results.every(result => result.error)) {
        throw new Error("Failed to fetch data for all tickers. Please check your API credentials or try again later.");
      }
      
      // Process results
      const financialDataByTicker = {};
      const liveMarketDataByTicker = {};
      const peerComparisonByTicker = {};
      const analystRatingsByTicker = {};
      const capiqNewsByTicker = {};
      const expertCallsByTicker = {};
      const alphaSenseDocumentsByTicker = {};
      
      results.forEach(result => {
        if (result.error) {
          // Store error information for this ticker
          const errorData = { error: result.error };
          financialDataByTicker[result.ticker] = errorData;
          liveMarketDataByTicker[result.ticker] = errorData;
          peerComparisonByTicker[result.ticker] = errorData;
          analystRatingsByTicker[result.ticker] = errorData;
          capiqNewsByTicker[result.ticker] = errorData;
          expertCallsByTicker[result.ticker] = errorData;
          alphaSenseDocumentsByTicker[result.ticker] = errorData;
        } else {
          // Store successful data
          financialDataByTicker[result.ticker] = result.financialData;
          liveMarketDataByTicker[result.ticker] = result.liveMarketData;
          peerComparisonByTicker[result.ticker] = result.peerComparison;
          analystRatingsByTicker[result.ticker] = result.analystRatings;
          capiqNewsByTicker[result.ticker] = result.capiqNews;
          expertCallsByTicker[result.ticker] = result.expertCalls;
          alphaSenseDocumentsByTicker[result.ticker] = result.alphaSenseDocuments;
        }
      });
      
      setFinancialData(financialDataByTicker);
      setLiveMarketData(liveMarketDataByTicker);
      setPeerComparison(peerComparisonByTicker);
      setAnalystRatings(analystRatingsByTicker);
      setCapiqNews(capiqNewsByTicker);
      setExpertCalls(expertCallsByTicker);
      setAlphaSenseDocuments(alphaSenseDocumentsByTicker);
    } catch (error) {
      console.error('Error fetching all ticker data:', error);
      setError(error.message || "An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for manual refresh
  const handleManualRefresh = async () => {
    setLoading(true);
    await fetchData();
    setLastUpdated(new Date());
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-h-screen overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
            <div className="text-sm text-gray-500 mt-1">
              Live data - Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleManualRefresh}
              disabled={loading}
              className="text-primary hover:text-primary-dark disabled:text-gray-400"
            >
              <svg className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'financials' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('financials')}
          >
            CapIQ Financials
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'liveMarketData' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('liveMarketData')}
          >
            <span className="flex items-center">
              Live Market Data
              <span className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            </span>
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'capiqNews' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('capiqNews')}
          >
            CapIQ News
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'expertCalls' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('expertCalls')}
          >
            AlphaSense Calls
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'alphaSenseDocuments' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('alphaSenseDocuments')}
          >
            AlphaSense Documents
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {loading && !error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Loading live data from CapIQ and AlphaSense...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full bg-red-50 rounded-lg p-8">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-medium text-red-800 text-center mt-2">API Connection Error</h3>
              </div>
              <p className="text-center text-red-700 mb-4">{error}</p>
              <p className="text-center text-gray-600 max-w-lg">
                Please check your API credentials and network connection. If the problem persists, 
                contact your system administrator or the API provider.
              </p>
              <button 
                onClick={handleManualRefresh}
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Project Information</h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Created</p>
                          <p className="mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Last Updated</p>
                          <p className="mt-1">{project.lastUpdated}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Progress</p>
                          <div className="mt-1 relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                              <div style={{ width: `${project.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                            </div>
                            <p className="text-sm mt-1">{project.progress}% Complete</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tickers</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {project.tickers.map((ticker, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {ticker}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h4 className="font-medium text-blue-700 mb-1">Companies</h4>
                        <p className="text-2xl font-bold">{project.tickers.length}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md">
                        <h4 className="font-medium text-green-700 mb-1">Financial Data Points</h4>
                        <p className="text-2xl font-bold">{Object.keys(financialData).length * 10}+</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-md">
                        <h4 className="font-medium text-purple-700 mb-1">Expert Calls</h4>
                        <p className="text-2xl font-bold">
                          {Object.values(expertCalls).reduce((total, calls) => total + calls.length, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'financials' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">Financial Data from CapIQ</h3>
                    <div className="text-sm text-gray-500">
                      Source: Capital IQ
                    </div>
                  </div>
                  
                  {project.tickers.map((ticker) => (
                    <div key={ticker} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <h4 className="font-medium text-gray-800">{ticker}</h4>
                      </div>
                      <div className="p-4">
                        {financialData[ticker] ? (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Key Financials (USD)</h5>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2022</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2021</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2020</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  <tr>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Revenue</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{financialData[ticker].financials.revenue['2022']}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{financialData[ticker].financials.revenue['2021']}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{financialData[ticker].financials.revenue['2020']}</td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Net Income</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{financialData[ticker].financials.netIncome['2022']}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{financialData[ticker].financials.netIncome['2021']}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{financialData[ticker].financials.netIncome['2020']}</td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">EPS</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{financialData[ticker].financials.eps['2022']}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{financialData[ticker].financials.eps['2021']}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{financialData[ticker].financials.eps['2020']}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            
                            <h5 className="font-medium text-gray-700 mt-4 mb-2">Key Ratios</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-500">P/E Ratio</p>
                                <p className="text-lg font-semibold">{financialData[ticker].ratios.pe}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-500">P/B Ratio</p>
                                <p className="text-lg font-semibold">{financialData[ticker].ratios.pb}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-500">Debt/Equity</p>
                                <p className="text-lg font-semibold">{financialData[ticker].ratios.debtToEquity}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-500">Current Ratio</p>
                                <p className="text-lg font-semibold">{financialData[ticker].ratios.currentRatio}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500">No financial data available for {ticker}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'liveMarketData' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">Live Market Data</h3>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                      Live Updates
                    </div>
                  </div>
                  
                  {project.tickers.map((ticker) => (
                    <div key={ticker} className="mb-6 border border-gray-200 rounded-lg p-4 overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-800 text-xl">{ticker}</h4>
                        {liveMarketData[ticker] && !liveMarketData[ticker].error ? (
                          <div className="flex items-center">
                            <span className={`text-xl font-bold ${
                              parseFloat(liveMarketData[ticker].changePercent) >= 0
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {liveMarketData[ticker].lastPrice}
                            </span>
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${
                              parseFloat(liveMarketData[ticker].changePercent) >= 0
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {parseFloat(liveMarketData[ticker].changePercent) >= 0 ? '+' : ''}
                              {liveMarketData[ticker].changePercent}%
                            </span>
                          </div>
                        ) : null}
                      </div>
                      
                      {liveMarketData[ticker] ? (
                        liveMarketData[ticker].error ? (
                          <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-red-700">Error: {liveMarketData[ticker].error}</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                              <h5 className="font-medium text-gray-700 mb-3">Market Statistics</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-500">Volume</span>
                                  <span className="text-sm font-medium">
                                    {Number(liveMarketData[ticker].volume).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-500">Market Cap</span>
                                  <span className="text-sm font-medium">
                                    ${Number(liveMarketData[ticker].marketCap / 1000000000).toFixed(2)}B
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-500">52 Week High</span>
                                  <span className="text-sm font-medium">{liveMarketData[ticker].high52Week}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-500">52 Week Low</span>
                                  <span className="text-sm font-medium">{liveMarketData[ticker].low52Week}</span>
                                </div>
                              </div>
                            </div>
                            
                            {analystRatings[ticker] && !analystRatings[ticker].error && (
                              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                                <h5 className="font-medium text-gray-700 mb-3">Analyst Coverage</h5>
                                <div className="flex items-center mb-3">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ 
                                      width: `${(analystRatings[ticker].buy / 
                                        (analystRatings[ticker].buy + 
                                          analystRatings[ticker].hold + 
                                          analystRatings[ticker].sell)) * 100}%` 
                                    }}></div>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="text-center">
                                    <div className="text-sm font-medium text-green-600">
                                      {analystRatings[ticker].buy}
                                    </div>
                                    <div className="text-xs text-gray-500">Buy</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm font-medium text-yellow-600">
                                      {analystRatings[ticker].hold}
                                    </div>
                                    <div className="text-xs text-gray-500">Hold</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm font-medium text-red-600">
                                      {analystRatings[ticker].sell}
                                    </div>
                                    <div className="text-xs text-gray-500">Sell</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      ) : (
                        <p className="text-gray-500">No live market data available for {ticker}</p>
                      )}
                      
                      {peerComparison[ticker] && !peerComparison[ticker].error && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-700 mb-3">Peer Comparison</h5>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ticker
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Change %
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    P/E Ratio
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {peerComparison[ticker].peers.map((peer, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {peer.ticker}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {peer.lastPrice}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <span className={parseFloat(peer.changePercent) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {parseFloat(peer.changePercent) >= 0 ? '+' : ''}
                                        {peer.changePercent}%
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {peer.peRatio}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'capiqNews' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">CapIQ News</h3>
                  </div>
                  
                  {project.tickers.map((ticker) => (
                    <div key={ticker} className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">{ticker} CapIQ News</h4>
                      
                      {capiqNews[ticker] && capiqNews[ticker].length > 0 ? (
                        <div className="space-y-3">
                          {capiqNews[ticker].map((news) => (
                            <div key={news.id} className="border border-gray-200 rounded-lg p-4">
                              <h5 className="font-medium text-gray-800">{news.title}</h5>
                              <p className="text-sm text-gray-500 mt-1">Date: {news.date}</p>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">{news.summary}</p>
                              </div>
                              <div className="mt-3 pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Source</p>
                                <div className="flex flex-wrap gap-1">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {news.source}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No CapIQ news available for {ticker}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'expertCalls' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">Expert Calls from AlphaSense</h3>
                    <div className="text-sm text-gray-500">
                      Source: AlphaSense
                    </div>
                  </div>
                  
                  {project.tickers.map((ticker) => (
                    <div key={ticker} className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">{ticker} Expert Calls</h4>
                      
                      {expertCalls[ticker] && expertCalls[ticker].length > 0 ? (
                        <div className="space-y-3">
                          {expertCalls[ticker].map((call) => (
                            <div key={call.id} className="border border-gray-200 rounded-lg p-4">
                              <h5 className="font-medium text-gray-800">{call.title}</h5>
                              <p className="text-sm text-gray-500 mt-1">Date: {call.date}</p>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">{call.summary}</p>
                              </div>
                              <div className="mt-3 pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Participants</p>
                                <div className="flex flex-wrap gap-1">
                                  {call.participants.map((participant, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {participant}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No expert calls available for {ticker}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'alphaSenseDocuments' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">AlphaSense Documents</h3>
                  </div>
                  
                  {project.tickers.map((ticker) => (
                    <div key={ticker} className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">{ticker} AlphaSense Documents</h4>
                      
                      {alphaSenseDocuments[ticker] && alphaSenseDocuments[ticker].length > 0 ? (
                        <div className="space-y-3">
                          {alphaSenseDocuments[ticker].map((document) => (
                            <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                              <h5 className="font-medium text-gray-800">{document.title}</h5>
                              <p className="text-sm text-gray-500 mt-1">Date: {document.date}</p>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">{document.summary}</p>
                              </div>
                              <div className="mt-3 pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Source</p>
                                <div className="flex flex-wrap gap-1">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {document.source}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No AlphaSense documents available for {ticker}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
          <button 
            className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
          <button className="btn btn-primary">
            Update Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 