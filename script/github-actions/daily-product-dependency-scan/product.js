class Product {
  constructor({ productId, productPath }) {
    this.productId = productId;
    this.productPath = productPath;
    this.packageDependencies = new Set();
    this.crossProductDependencies = new Set();
  }
}

module.exports = Product;
