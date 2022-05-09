const constants = require('./constants');

class Headings {
  constructor({ csvLine }) {
    this.all = csvLine.split(';');
    [
      this.packageDependencyIndex,
      this.crossProductDependencyIndex,
    ] = this.getDependencyHeadingIndices();
  }

  getDependencyHeadingIndices() {
    let packageDependencyIndex;
    let crossProductDependencyIndex;

    this.all.forEach((heading, index) => {
      if (heading === constants.PACKAGE_DEPENDENCIES) {
        packageDependencyIndex = index;
      } else if (heading === constants.CROSS_PRODUCT_DEPENDENCIES) {
        crossProductDependencyIndex = index;
      }
    });

    return [packageDependencyIndex, crossProductDependencyIndex];
  }
}

module.exports = Headings;
