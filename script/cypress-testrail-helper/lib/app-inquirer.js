const inq = require('inquirer');

module.exports = {
  askMyConfigOptions() {
    const questions = [
      {
        name: 'trUsername',
        type: 'input',
        message: 'Enter your TestRail username:',
        validate(val) {
          if (val.length) {
            return true;
          }

          return 'Please enter username.';
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

          return 'Please enter API Key.';
        },
      },
    ];

    return inq.prompt(questions);
  },

  askSpecFilename() {
    const questions = [
      {
        name: 'specFilename',
        type: 'input',
        message: 'Enter your Cypress spec filename:',
        validate(val) {
          if (val.length) {
            return true;
          }

          return 'Please enter filename!';
        },
      },
    ];

    return inq.prompt(questions);
  },

  askSpecFileChoice(files) {
    const questions = [
      {
        name: 'specFile',
        type: 'list',
        message: 'Choose spec from the following list:',
        choices: files.map(f => Object.assign({}, { name: f, value: f })),
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
        message:
          "Enter your Cypress spec's corresponding TestRail Run Name [no spaces]:",
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
        message: "Enter your Cypress spec's project-root-relative path:",
        // validate(val) {
        //   if (val.length && val.includes('.cypress.spec.js')) {
        //     return true;
        //   }

        //   return val.length
        //     ? 'File extension ".cypress.spec.js(x)" not found!'
        //     : 'Please enter spec-file path!';
        // },
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
