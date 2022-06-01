/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

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
      const scannedProduct = products[productId];

      // check if path_to_code has changed
      if (
        this.isNewPathToCode({
          currentPath: product.pathToCode,
          scannedPath: scannedProduct.pathToCode,
        })
      ) {
        updatedProductDirectory[productId].pathToCode =
          scannedProduct.pathToCode;
        this.changeDetected = true;
      }

      // check if hasUnitTests, hasE2eTests, hasContractTests has changed
      ['hasUnitTests', 'hasE2eTests', 'hasContractTests'].forEach(attribute => {
        if (
          this.isNewBoolean({
            currentValue: product[productDirectoryProps[attribute]],
            scannedValue: scannedProduct[attribute],
          })
        ) {
          updatedProductDirectory[productId][productDirectoryProps[attribute]] =
            scannedProduct[attribute];
          this.changeDetected = true;
        }
      });

      // check if packageDependencies, crossProductDependencies has changed
      ['packageDependencies', 'crossProductDependencies'].forEach(attribute => {
        if (
          this.hasUpdatedDependencies({
            currentValue: product[productDirectoryProps[attribute]],
            scannedValue: scannedProduct[attribute],
          })
        ) {
          updatedProductDirectory[productId][productDirectoryProps[attribute]] =
            scannedProduct[attribute];
          this.changeDetected = true;
        }
      });
    });

    return Object.keys(updatedProductDirectory).map(
      productId => updatedProductDirectory[productId],
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
    return !_.isEqual(currentValue.sort(), scannedValue.sort());
  }
}

module.exports = Differ;
