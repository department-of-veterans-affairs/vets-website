const constants = require('./constants');

class Headings {
  constructor({ csvLine }) {
    this.all = csvLine.split(';');
    this.setFieldHeadingIndices();
  }

  setFieldHeadingIndices() {
    this.all.forEach((heading, index) => {
      switch (heading) {
        case constants.PACKAGE_DEPENDENCIES:
          this.packageDependencyIndex = index;
          break;
        case constants.CROSS_PRODUCT_DEPENDENCIES:
          this.crossProductDependencyIndex = index;
          break;
        case constants.HAS_UNIT_TESTS:
          this.hasUnitTestsIndex = index;
          break;
        case constants.HAS_E2E_TESTS:
          this.hasE2eTestsIndex = index;
          break;
        case constants.HAS_CONTRACT_TESTS:
          this.hasContractTestsIndex = index;
          break;
        case constants.PATH_TO_CODE:
          this.pathToCodeIndex = index;
          break;
        default:
      }
    });
  }
}

module.exports = Headings;
