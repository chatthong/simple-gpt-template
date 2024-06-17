module.exports = {
  apps: [
    {
      name: 'chat-app',
      script: './server.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
