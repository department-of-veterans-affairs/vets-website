const githubAppCredentials = {
  appId: process.env.PRODUCT_DIRECTORY_APP_ID,
  privateKey: process.env.PRODUCT_DIRECTORY_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
  // installationId: 25571972,
  installationId: 25328042,
};

module.exports = githubAppCredentials;
