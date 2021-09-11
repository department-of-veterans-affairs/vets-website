const inq = require('inquirer');

module.exports = {
  askTestRailConfigOptions() {
    const questions = [
      {
        name: 'trUsername',
        type: 'input',
        message: 'Enter your TestRail username:',
        validate(val) {
          if (val.length) {
            return true;
          }

          return 'Please enter your TestRail username.';
        },
      },
      {
        name: 'trPassword',
        type: 'input',
        message: 'Enter your TestRail API Key:',
        validate(val) {
          if (val.length) {
            return true;
          }

          return 'Please enter your TestRail API Key.';
        },
      },
      {
        name: 'trProjectId',
        type: 'input',
        message: 'Enter your TestRail Project ID:',
        validate(val) {
          if (val.length) {
            return true;
          }

          return 'Please enter your TestRail Project ID.';
        },
      },
      {
        name: 'trSuiteId',
        type: 'input',
        message: 'Enter your TestRail Suite ID:',
        validate(val) {
          if (val.length) {
            return true;
          }

          return 'Please enter your TestRail Suite ID.';
        },
      },
    ];

    return inq.prompt(questions);
  },

  askTestRailRunOptions() {
    const questions = [
      {
        name: 'groupId',
        type: 'input',
        message: "Enter your Cypress spec's corresponding TestRail Group ID:",
        validate(val) {
          if (val.length) {
            return true;
          }

          return 'Please enter TestRail Group ID.';
        },
      },
      {
        name: 'runName',
        type: 'input',
        message: 'Enter your TestRail Run Name [no spaces]:',
        validate(val) {
          if (val.length && !val.includes(' ')) {
            return true;
          }

          return val.length
            ? 'Please do not use spaces!  Use underscore ("_") instead.'
            : 'Please enter Run Name!';
        },
      },
      {
        name: 'specPath',
        type: 'input',
        message: 'Enter path of your Cypress spec-file:',
        validate(val) {
          if (val.length && val.includes('.cypress.spec.js')) {
            return true;
          }

          return val.length
            ? 'File extension ".cypress.spec.js(x)" not found!'
            : 'Please enter spec-file path!';
        },
      },
    ];

    return inq.prompt(questions);
  },

  askTestRailProjectOptions() {
    const questions = [
      {
        name: 'trProjectId',
        type: 'input',
        message: 'Enter the TestRail Project ID:',
        validate(val) {
          if (val.length) {
            return true;
          }

          return 'Please enter TestRail Project ID.';
        },
      },
      {
        name: 'trSuiteId',
        type: 'input',
        message: 'Enter the TestRail Suite ID:',
        validate(val) {
          if (val.length) {
            return true;
          }

          return 'Please  enter TestRail Suite ID.';
        },
      },
    ];

    return inq.prompt(questions);
  },
};
