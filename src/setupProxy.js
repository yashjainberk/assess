const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for CapIQ API
  app.use(
    '/api/capiq',
    createProxyMiddleware({
      target: 'https://api.capitaliq.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/capiq': '', // remove /api/capiq prefix when forwarding
      },
      headers: {
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      logLevel: 'debug',
    })
  );

  // Proxy for AlphaSense API
  app.use(
    '/api/alphasense',
    createProxyMiddleware({
      target: 'https://api.alphasense.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/alphasense': '', // remove /api/alphasense prefix when forwarding
      },
      headers: {
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      logLevel: 'debug',
    })
  );
}; 