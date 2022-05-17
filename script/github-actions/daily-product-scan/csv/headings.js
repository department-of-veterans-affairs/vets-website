const headingNames = require('./heading-names');

class Headings {
  constructor({ csvLine }) {
    this.all = csvLine.split(';');
    this.setFieldHeadingIndices();
  }

  setFieldHeadingIndices() {
    this.all.forEach((heading, index) => {
      switch (heading) {
        case headingNames.PACKAGE_DEPENDENCIES:
          this.packageDependenciesIndex = index;
          break;
        case headingNames.CROSS_PRODUCT_DEPENDENCIES:
          this.crossProductDependenciesIndex = index;
          break;
        case headingNames.HAS_UNIT_TESTS:
          this.hasUnitTestsIndex = index;
          break;
        case headingNames.HAS_E2E_TESTS:
          this.hasE2eTestsIndex = index;
          break;
        case headingNames.HAS_CONTRACT_TESTS:
          this.hasContractTestsIndex = index;
          break;
        case headingNames.PATH_TO_CODE:
          this.pathToCodeIndex = index;
          break;
        default:
      }
    });
  }
}

module.exports = Headings;
