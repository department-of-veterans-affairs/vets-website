/* eslint-disable class-methods-use-this */
const glob = require('glob');

class TestTypes {
  constructor({ products }) {
    this.products = products;
    this.types = {
      Unit: '**/*unit.spec.js?(x)',
      E2e: '**/*cypress.spec.js?(x)',
    };
  }

  checkExistance() {
    Object.keys(this.products).forEach(uuid => {
      const product = this.products[uuid];

      Object.keys(this.types).forEach(type => {
        const globPattern = this.types[type];

        product[`has${type}Tests`] = this.doesExist({
          product,
          globPattern,
        });
      });
    });
  }

  doesExist({ product, globPattern }) {
    const paths = glob.sync(`${product.pathToCode}/${globPattern}`);
    return paths.length > 0;
  }
}

module.exports = TestTypes;
