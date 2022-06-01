/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

const _ = require('lodash');

const productDirectoryProps = require('./product-directory-props');

class Differ {
  constructor() {
    this.changeDetected = false;
  }

  diff({ products, currentProductDirectory }) {
    const updatedProductDirectory = {};

    _.cloneDeep(currentProductDirectory).forEach(product => {
      updatedProductDirectory[product.product_id] = product;
    });

    currentProductDirectory.forEach(product => {
      const productId = product.product_id;
      const scannedProduct = products.all[productId];

      if (scannedProduct === undefined) return;

      // check if path_to_code has changed
      if (
        this.isNewPathToCode({
          currentPath: product.path_to_code,
          scannedPath: scannedProduct.pathToCode,
        })
      ) {
        updatedProductDirectory[productId].pathToCode =
          scannedProduct.pathToCode;
        this.changeDetected = true;
      }

      // check if hasUnitTests, hasE2eTests, hasContractTests has changed
      ['hasUnitTests', 'hasE2eTests', 'hasContractTests'].forEach(
        (attribute, i) => {
          const currentValue = product[productDirectoryProps[attribute]]; // key is snake case
          const scannedValue = scannedProduct[attribute]; // key is camel case

          if (
            this.isNewBoolean({
              currentValue,
              scannedValue,
            })
          ) {
            // if (i === 0) {
            //   console.log('attribute', attribute);
            //   console.log(
            //     'productDirectoryProps[attribute]',
            //     productDirectoryProps[attribute],
            //   );
            //   console.log(
            //     'updatedProductDirectory[productId]',
            //     updatedProductDirectory[productId],
            //   );
            //   console.log(
            //     'updatedProductDirectory[productId][productDirectoryProps[attribute]]',
            //     updatedProductDirectory[productId][
            //       productDirectoryProps[attribute]
            //     ],
            //   );
            // }

            updatedProductDirectory[productId][
              productDirectoryProps[attribute]
            ] = scannedProduct[attribute];
            this.changeDetected = true;
          }
        },
      );

      // check if packageDependencies, crossProductDependencies has changed
      ['packageDependencies', 'crossProductDependencies'].forEach(
        (attribute, i) => {
          const currentValue = product[productDirectoryProps[attribute]]
            ? product[productDirectoryProps[attribute]].split(',').sort()
            : [];
          const scannedValue = Array.from(scannedProduct[attribute]).sort();

          // if (i === 0) {
          //   console.log('attribute', attribute);
          //   console.log(
          //     'productDirectoryProps[attribute]',
          //     productDirectoryProps[attribute],
          //   );
          //   console.log(
          //     'updatedProductDirectory[productId]',
          //     updatedProductDirectory[productId],
          //   );
          //   console.log(
          //     'updatedProductDirectory[productId][productDirectoryProps[attribute]]',
          //     updatedProductDirectory[productId][
          //       productDirectoryProps[attribute]
          //     ],
          //   );
          //   console.log('scannedValue', scannedValue);
          // }

          if (
            this.hasUpdatedDependencies({
              currentValue,
              scannedValue,
            })
          ) {
            // updatedProductDirectory[productId][
            //   productDirectoryProps[attribute]
            // ] = scannedValue.join(',');

            updatedProductDirectory[productId][
              productDirectoryProps[attribute]
            ] = 'HELLO, IS THIS GETTING UPDATED?!?!';
            this.changeDetected = true;
          }
        },
      );
    });

    console.log(JSON.stringify(updatedProductDirectory, null, 2));

    return JSON.stringify(
      Object.keys(updatedProductDirectory).map(
        productId => updatedProductDirectory[productId],
      ),
      null,
      2,
    );
  }

  isNewPathToCode({ currentPath, scannedPath }) {
    return currentPath !== scannedPath;
  }

  isNewBoolean({ currentValue, scannedValue }) {
    const currentValueAsBoolean =
      currentValue === 'true' || currentValue === 'TRUE';
    return currentValueAsBoolean !== scannedValue;
  }

  hasUpdatedDependencies({ currentValue, scannedValue }) {
    return !_.isEqual(currentValue, scannedValue);
  }
}

module.exports = Differ;
