module.exports = {
  apps: [
    {
      name: "intercom-trad-demo",
      script: "app.js",
      watch: true,
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
