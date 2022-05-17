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
        const pathToCode = path.slice(0, path.lastIndexOf('/'));
        this.all[productId] = new Product({ pathToCode });
      }
    });
  }
}

module.exports = Products;
