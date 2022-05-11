class Product {
  constructor({ productPath }) {
    this.productPath = productPath;
    this.packageDependencies = new Set();
    this.crossProductDependencies = new Set();
    this.hasUnitTests = null;
    this.hasE2eTests = null;
    this.hasContractTests = null;
  }
}

module.exports = Product;
