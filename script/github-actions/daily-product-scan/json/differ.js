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
      const currentPath = product.path_to_code;
      const scannedPath = scannedProduct.pathToCode;

      if (
        this.isNewPathToCode({
          currentPath,
          scannedPath,
        })
      ) {
        // eslint-disable-next-line camelcase
        updatedProductDirectory[productId].path_to_code = scannedPath;
        this.changeDetected = true;
      }
      // check if last_updated has changed
      const currentDate =
        product.last_updated === ''
          ? new Date(null)
          : new Date(product.last_updated);
      const scannedDate = new Date(scannedProduct.lastUpdated);
      if (scannedDate > currentDate) {
        // eslint-disable-next-line camelcase
        updatedProductDirectory[productId].last_updated = scannedDate;
        this.changeDetected = true;
      }

      // check if hasUnitTests, hasE2eTests has changed
      ['hasUnitTests', 'hasE2eTests'].forEach(attribute => {
        const currentValue = product[productDirectoryProps[attribute]];
        const scannedValue = scannedProduct[attribute];

        if (
          this.isNewBoolean({
            currentValue,
            scannedValue,
          })
        ) {
          updatedProductDirectory[productId][
            productDirectoryProps[attribute]
          ] = scannedValue;
          this.changeDetected = true;
        }
      });

      // check if packageDependencies, crossProductDependencies has changed
      ['packageDependencies', 'crossProductDependencies'].forEach(attribute => {
        const currentValue = product[productDirectoryProps[attribute]]
          ? product[productDirectoryProps[attribute]]
          : [];
        const scannedValue = Array.from(scannedProduct[attribute]).sort();

        if (
          this.hasUpdatedDependencies({
            currentValue,
            scannedValue,
          })
        ) {
          updatedProductDirectory[productId][
            productDirectoryProps[attribute]
          ] = scannedValue;
          this.changeDetected = true;
        }
      });
    });

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
      currentValue === true ||
      currentValue === 'true' ||
      currentValue === 'TRUE';
    return currentValueAsBoolean !== scannedValue;
  }

  hasUpdatedDependencies({ currentValue, scannedValue }) {
    return !_.isEqual(currentValue, scannedValue);
  }
}

module.exports = Differ;
