/**
 * Mock data generator for CapIQ and AlphaSense API responses
 * Used as fallback when real API calls fail
 */

// Generate mock financial data for a ticker
export const generateFinancialData = (ticker) => {
  const randomRevenue = (Math.random() * 50 + 100).toFixed(2);
  const randomEPS = (Math.random() * 2 + 1).toFixed(2);
  const randomPE = (Math.random() * 10 + 20).toFixed(2);
  
  return {
    ticker,
    financials: {
      revenue: {
        '2022': `$${randomRevenue}B`,
        '2021': `$${(randomRevenue * 0.9).toFixed(2)}B`,
        '2020': `$${(randomRevenue * 0.8).toFixed(2)}B`
      },
      netIncome: {
        '2022': `$${(randomRevenue * 0.25).toFixed(2)}B`,
        '2021': `$${(randomRevenue * 0.9 * 0.25).toFixed(2)}B`,
        '2020': `$${(randomRevenue * 0.8 * 0.25).toFixed(2)}B`
      },
      eps: {
        '2022': `$${randomEPS}`,
        '2021': `$${(randomEPS * 0.9).toFixed(2)}`,
        '2020': `$${(randomEPS * 0.8).toFixed(2)}`
      }
    },
    ratios: {
      pe: parseFloat(randomPE),
      pb: parseFloat((randomPE * 0.3).toFixed(2)),
      debtToEquity: parseFloat((Math.random() * 1 + 0.5).toFixed(2)),
      currentRatio: parseFloat((Math.random() * 0.5 + 1).toFixed(2))
    }
  };
};

// Generate mock live market data for a ticker
export const generateLiveMarketData = (ticker) => {
  const basePrice = ticker === 'AAPL' ? 175 : ticker === 'MSFT' ? 350 : ticker === 'TSLA' ? 240 : 100;
  const price = (basePrice + Math.random() * 10).toFixed(2);
  const changePercent = (Math.random() * 5 - 2.5).toFixed(2);
  const volume = Math.floor(Math.random() * 10000000 + 5000000);
  const marketCap = ticker === 'AAPL' ? 2800000000000 : ticker === 'MSFT' ? 2600000000000 : 800000000000;
  
  return {
    ticker,
    lastPrice: price,
    changePercent: changePercent,
    volume: volume,
    marketCap: marketCap,
    high52Week: (basePrice * 1.3).toFixed(2),
    low52Week: (basePrice * 0.7).toFixed(2),
    lastUpdated: new Date().toISOString()
  };
};

// Generate mock analyst ratings for a ticker
export const generateAnalystRatings = (ticker) => {
  return {
    buy: Math.floor(Math.random() * 10 + 15),
    hold: Math.floor(Math.random() * 5 + 8),
    sell: Math.floor(Math.random() * 3 + 1),
    targetPrice: (Math.random() * 50 + 150).toFixed(2)
  };
};

// Generate mock peer comparison data
export const generatePeerComparison = (ticker) => {
  const peers = ['AAPL', 'MSFT', 'GOOGL', 'META', 'AMZN', 'TSLA'].filter(p => p !== ticker).slice(0, 4);
  
  return {
    ticker,
    peers: peers.map(peer => ({
      ticker: peer,
      lastPrice: (Math.random() * 200 + 100).toFixed(2),
      changePercent: (Math.random() * 5 - 2.5).toFixed(2),
      peRatio: (Math.random() * 10 + 20).toFixed(2)
    }))
  };
};

// Generate mock news for a ticker
export const generateNews = (ticker) => {
  const companyNames = {
    'AAPL': 'Apple',
    'MSFT': 'Microsoft',
    'GOOGL': 'Google',
    'META': 'Meta',
    'AMZN': 'Amazon',
    'TSLA': 'Tesla',
    'NVDA': 'NVIDIA',
    'RIVN': 'Rivian',
    'LCID': 'Lucid Motors'
  };
  
  const companyName = companyNames[ticker] || ticker;
  const sources = ['Wall Street Journal', 'Bloomberg', 'CNBC', 'Reuters', 'Financial Times'];
  const headlines = [
    `${companyName} Reports Strong Quarterly Earnings`,
    `${companyName} Announces New Product Line`,
    `Analysts Upgrade ${companyName}`,
    `${companyName} Expands into New Markets`,
    `${companyName} CEO Discusses Future Growth`
  ];
  
  return {
    ticker,
    news: Array(5).fill().map((_, i) => ({
      id: `${ticker}-news-${i + 1}`,
      title: headlines[i],
      source: sources[i],
      date: new Date(Date.now() - (i * 2 + 1) * 24 * 60 * 60 * 1000).toISOString(),
      url: '#',
      sentiment: Math.random() > 0.3 ? 'positive' : Math.random() > 0.5 ? 'neutral' : 'negative'
    }))
  };
};

// Generate mock expert calls data
export const generateExpertCalls = (ticker) => {
  const companyNames = {
    'AAPL': 'Apple',
    'MSFT': 'Microsoft',
    'GOOGL': 'Google',
    'META': 'Meta',
    'AMZN': 'Amazon',
    'TSLA': 'Tesla',
    'NVDA': 'NVIDIA',
    'RIVN': 'Rivian',
    'LCID': 'Lucid Motors'
  };
  
  const companyName = companyNames[ticker] || ticker;
  const callTypes = ['Earnings Call', 'Analyst Day', 'Industry Conference', 'Investor Presentation', 'Product Launch Event'];
  
  return {
    ticker,
    expertCalls: Array(5).fill().map((_, i) => ({
      id: `${ticker}-call-${i + 1}`,
      title: `${companyName} ${callTypes[i]}`,
      date: new Date(Date.now() - (i * 30 + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      participants: ['CEO', 'CFO', 'Head of Product', 'Head of IR', 'CTO'].slice(0, Math.floor(Math.random() * 3) + 2),
      summary: `${companyName} ${callTypes[i]} discussing quarterly performance and strategic initiatives.`,
      transcript: `This is a sample transcript of the ${callTypes[i]} for ${companyName}.`,
      sentiment: Math.random() > 0.3 ? 'positive' : Math.random() > 0.5 ? 'neutral' : 'negative',
      keyInsights: [
        `${companyName} reported strong growth in key markets`,
        `New product roadmap to be implemented in Q4`,
        `Challenges in supply chain being addressed through strategic partnerships`
      ],
      audioUrl: '#'
    }))
  };
};

// Generate mock documents data
export const generateDocuments = (ticker) => {
  const documentTypes = ['SEC Filing', 'Research Report', 'Company Materials', 'Press Release', 'Investor Presentation'];
  const sources = ['SEC EDGAR', 'Morgan Stanley', 'Company Website', 'PR Newswire', 'Investor Relations'];
  
  return {
    ticker,
    documents: Array(5).fill().map((_, i) => ({
      id: `${ticker}-doc-${i + 1}`,
      title: `${ticker} ${documentTypes[i]}`,
      date: new Date(Date.now() - (i * 45 + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: documentTypes[i],
      source: sources[i],
      summary: `${documentTypes[i]} for ${ticker} covering recent business activities and financial results.`,
      url: '#',
      sentiment: Math.random() > 0.3 ? 'positive' : Math.random() > 0.5 ? 'neutral' : 'negative',
      keyInsights: [
        `Revenue growth across all segments`,
        `Margin improvement initiatives showing results`,
        `International expansion progressing on schedule`
      ]
    }))
  };
}; 