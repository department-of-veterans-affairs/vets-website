const Product = require('./product');

class Products {
  constructor() {
    this.all = {};
  }

  addProducts({ productPaths }) {
    productPaths.forEach(path => {
      const { productId, pathToCode } = path;
      if (productId) {
        this.all[productId] = new Product({ pathToCode });
      }
    });
  }
}

module.exports = Products;
