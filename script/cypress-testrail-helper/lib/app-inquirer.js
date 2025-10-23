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
};
