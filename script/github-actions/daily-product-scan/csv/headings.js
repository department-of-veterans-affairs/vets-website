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
          this.hasUnitTests = index;
          break;
        case constants.HAS_E2E_TESTS:
          this.hasE2eTests = index;
          break;
        case constants.HAS_CONTRACT_TESTS:
          this.hasContractTests = index;
          break;
        default:
      }
    });
  }
}

module.exports = Headings;
