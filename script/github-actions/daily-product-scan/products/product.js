class Product {
  constructor({ productPath }) {
    this.productPath = productPath;
    this.packageDependencies = new Set();
    this.crossProductDependencies = new Set();
  }
}

module.exports = Product;
