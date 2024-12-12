const path = require('path');
const fs = require('fs');

// Get the app name from the environment variable in yarn mock command
const appName = process.env.APP_NAME;

if (!appName) {
  // eslint-disable-next-line no-console
  console.error(
    'No APP_NAME specified. Provide an APP_NAME environment variable in the yarn mock command.',
  );
  process.exit(1);
}

// Dynamically load the shared user data
const sharedUserData = require('./mock-data/sharedUserData');

// Dynamically load app-specific mock data based on app name
async function loadAppSpecificData(appSpecificName) {
  const appSpecificDataPath = path.join(
    __dirname,
    'mock-data',
    `${appSpecificName}.js`,
  );

  if (fs.existsSync(appSpecificDataPath)) {
    const appSpecificData = await import(appSpecificDataPath);

    // Check if imported data has a default key then grab the data
    if (appSpecificData.default) {
      return appSpecificData.default;
    }
    return appSpecificData;
  }

  // eslint-disable-next-line no-console
  console.warn(`No app-specific mock data found for ${appSpecificName}.`);
  return {};
}

// Combine shared data with app specific data
async function getUserData(appSpecificName) {
  const appData = await loadAppSpecificData(appSpecificName);
  return { ...sharedUserData, ...appData };
}

// dynamic mock response
module.exports = {
  'GET /v0/user': async (req, res) => {
    const userData = await getUserData(appName);
    res.status(200).json(userData);
  },

  'GET /v0/in-progress-forms/:appName': async (req, res) => {
    const userData = await getUserData(appName);
    res.status(200).json(userData.prefill);
  },
};
