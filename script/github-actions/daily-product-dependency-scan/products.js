const fs = require('fs');

const Product = require('./product');

class Products {
  constructor() {
    this.all = {};
  }

  addProducts({ manifestPaths }) {
    manifestPaths.forEach(path => {
      const manifest = JSON.parse(fs.readFileSync(path));
      const productId = manifest.productId || null;
      const productPath = path.slice(0, path.lastIndexOf('/'));

      this.all[productPath] = new Product({ productId, productPath });
    });
  }

  swapKeys() {
    this.all.forEach(product => {
      if (product.productId) {
        const { packageDependencies, crossProductDependencies } = product;

        this.all[product.productId] = {
          packageDependencies,
          crossProductDependencies,
        };
      }

      delete this.all[product.productPath];
    });
  }
}

module.exports = Products;
