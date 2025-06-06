/* eslint-disable no-console */
const yeoman = require('yeoman-environment');
const path = require('path');

// Create a Yeoman environment
const env = yeoman.createEnv();

// Use the npm-published generator
env.lookup();

// Define all options for the generator
const options = {
  // App generator options
  appName: 'My Test Application',
  folderName: 'my-test-app',
  entryName: 'my-test-app',
  rootUrl: '/my-test-app',
  isForm: true,
  slackGroup: '@test-group',
  contentLoc: path.resolve('../vagov-content'),
  formNumber: '21P-530',
  trackingPrefix: 'test-530-',
  respondentBurden: '30',
  ombNumber: '2900-0797',
  expirationDate: '12/31/2026',
  benefitDescription: 'test benefits',
  usesVetsJsonSchema: false,
  usesMinimalHeader: false,
  templateType: 'WITH_1_PAGE',
};

// Run the generator with all options
env
  .run('@department-of-veterans-affairs/vets-website', options)
  .then(() => {
    console.log('Generator completed successfully!');
  })
  .catch(err => {
    console.error('Generator failed:', err);
  });
