const fs = require('fs');

const Product = require('./product');

class Products {
  constructor() {
    this.all = {};
  }

  addProducts({ manifestPaths }) {
    manifestPaths.forEach(path => {
      const manifest = JSON.parse(fs.readFileSync(path));
      const { productId } = manifest;

      if (productId) {
        const productPath = path.slice(0, path.lastIndexOf('/'));
        this.all[productId] = new Product({ productPath });
      }
    });
  }
}

module.exports = Products;
