class Product {
  constructor({ pathToCode }) {
    this.pathToCode = pathToCode;
    this.packageDependencies = new Set();
    this.crossProductDependencies = new Set();
    this.hasUnitTests = null;
    this.hasE2eTests = null;
    this.hasContractTests = null;
    this.lastUpdated = null;
  }
}

module.exports = Product;
