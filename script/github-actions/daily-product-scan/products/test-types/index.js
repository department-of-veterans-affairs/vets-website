/* eslint-disable class-methods-use-this */
const glob = require('glob');

class TestTypes {
  constructor() {
    this.types = {
      Unit: '**/*unit.spec.js',
      E2e: '**/*cypress.spec.js',
      Contract: '**/*pact.spec.js',
    };
  }

  checkExistance({ products }) {
    Object.keys(products).forEach(uuid => {
      const product = products[uuid];

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
    const paths = glob.sync(`${product.productPath}/${globPattern}`);
    return paths.length > 0;
  }
}

module.exports = TestTypes;

// /* eslint-disable class-methods-use-this */
// const glob = require('glob');

// class TestTypes {
//   constructor() {
//     this.unitGlob = '**/*unit.spec.js';
//     this.e2eGlob = '**/*cypress.spec.js';
//     this.contractGlob = '**/*pact.spec.js';
//   }

//   checkExistance({ products }) {
//     Object.keys(products).forEach(productId => {
//       const product = products[productId];

//       product.hasUnitTests = this.check({
//         product,
//         globPattern: this.unitGlob,
//       });

//       product.hasE2eTests = this.check({
//         product,
//         globPattern: this.e2eGlob,
//       });

//       product.hasContractTests = this.check({
//         product,
//         globPattern: this.contractGlob,
//       });
//     });
//   }

//   check({ product, globPattern }) {
//     const paths = glob.sync(`${product.productPath}/${globPattern}`);
//     return paths.length > 0;
//   }
// }

// module.exports = TestTypes;
