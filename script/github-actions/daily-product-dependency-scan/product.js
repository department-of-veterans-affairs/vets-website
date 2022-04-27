class Product {
  constructor({ productId, productPath }) {
    this.productId = productId;
    this.productPath = productPath;
    this.packageDependencies = new Set();
    this.productsThatThisProductImportsFrom = new Set();
    this.productsThatImportFromThisProduct = new Set();
  }
}

module.exports = Product;
