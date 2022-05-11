class Product {
  constructor({ productPath }) {
    this.productPath = productPath;
    this.packageDependencies = new Set();
    this.crossProductDependencies = new Set();
    this.hasUnitTests = false;
    this.hasE2eTests = false;
    this.hasContractTests = false;
  }
}

module.exports = Product;
