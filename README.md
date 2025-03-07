# Financial Analysis Platform

A comprehensive financial analysis platform with real-time integration of Capital IQ and AlphaSense data.

## Features

- **Live Market Data**: Real-time market data for stocks using Capital IQ's API
- **Expert Calls**: Access to expert calls and transcripts via AlphaSense integration
- **Financial Analysis**: Comprehensive financial data and analyst coverage
- **Document Research**: SEC filings and research reports via AlphaSense
- **Collaborative Projects**: Create and share financial analysis projects with team members

## Setup

### Prerequisites

- Node.js 14.x or higher
- An active Capital IQ API subscription
- An active AlphaSense API subscription

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your API credentials in the `.env` file:
   ```
   REACT_APP_CAPIQ_API_ENDPOINT=https://api.capitaliq.com
   REACT_APP_CAPIQ_API_KEY=your-capiq-api-key
   REACT_APP_ALPHASENSE_API_ENDPOINT=https://api.alphasense.com
   REACT_APP_ALPHASENSE_API_KEY=your-alphasense-api-key
   ```

### Running the Application

```
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## API Integration Guide

### Capital IQ

This application integrates with the following Capital IQ API endpoints:

- `/v1/companies/{ticker}/financials` - Financial data
- `/v1/companies/{ticker}/market-data/live` - Live market data
- `/v1/companies/{ticker}/peers` - Peer comparison
- `/v1/companies/{ticker}/analyst-ratings` - Analyst ratings
- `/v1/companies/{ticker}/news` - Company news

To obtain a Capital IQ API key, please contact your S&P Global representative or visit [Capital IQ API Portal](https://www.capitaliq.com/api).

### AlphaSense

This application integrates with the following AlphaSense API endpoints:

- `/v1/expert-calls` - Expert calls and transcripts
- `/v1/documents` - SEC filings and research reports

To obtain an AlphaSense API key, please contact your AlphaSense representative or visit [AlphaSense Developer Portal](https://www.alpha-sense.com/api).

## Troubleshooting

### API Connection Issues

If you're experiencing issues with the API connections:

1. Verify your API keys are correct in the `.env` file
2. Check your network connection
3. Ensure your API subscription is active and has access to the required endpoints
4. Check the browser console for specific error messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.
