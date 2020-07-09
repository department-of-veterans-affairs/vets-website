const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  getBundleData() {
    this.log('Hello');
  }

  generateInputSchema() {}

  generateOutputSchema() {}

  generateTransformer() {}

  writeFiles() {}
};
