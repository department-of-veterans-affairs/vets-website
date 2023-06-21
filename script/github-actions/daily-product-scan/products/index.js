// const fs = require('fs');

const Product = require('./product');

class Products {
  constructor() {
    this.all = {};
  }

  addProducts({ productPaths }) {
    /* eslint-disable no-console */
    productPaths.forEach(path => {
      const productId = path.id;

      if (productId) {
        const pathToCode = path.path_to_code;
        this.all[productId] = new Product({ pathToCode });
        console.log(this.all);
      }
    });
  }
}

module.exports = Products;
