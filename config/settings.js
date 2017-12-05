// These values will become globally available under window.settings in a totally static file at /js/settings.js.
// Post-build, it can be edited in {build_directory}/js/settings.js.
const settings = {
  process: {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.API_URL,
    BASE_URL: process.env.BASE_URL
  },
  vic: {
    rateLimit: 0.5
  }
};

module.exports = settings;
