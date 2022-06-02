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
      const currentPath = product.path_to_code;
      const scannedPath = scannedProduct.pathToCode;

      if (
        this.isNewPathToCode({
          currentPath,
          scannedPath,
        })
      ) {
        console.log('in pathToCode');
        console.log('currentPath', currentPath);
        console.log('scannedPath', scannedPath);

        updatedProductDirectory[productId].pathToCode =
          scannedProduct.pathToCode;
        this.changeDetected = true;
      }

      // check if hasUnitTests, hasE2eTests, hasContractTests has changed
      ['hasUnitTests', 'hasE2eTests', 'hasContractTests'].forEach(attribute => {
        const currentValue = product[productDirectoryProps[attribute]];
        const scannedValue = scannedProduct[attribute];

        if (
          this.isNewBoolean({
            currentValue,
            scannedValue,
          })
        ) {
          console.log('in isNewBoolean');
          console.log('currentValue', currentValue);
          console.log('scannedValue', scannedValue);

          updatedProductDirectory[productId][
            productDirectoryProps[attribute]
          ] = scannedValue;
          this.changeDetected = true;
        }
      });

      // check if packageDependencies, crossProductDependencies has changed
      ['packageDependencies', 'crossProductDependencies'].forEach(attribute => {
        const currentValue = product[productDirectoryProps[attribute]]
          ? product[productDirectoryProps[attribute]].split(',').sort()
          : [];
        const scannedValue = Array.from(scannedProduct[attribute]).sort();

        if (
          this.hasUpdatedDependencies({
            currentValue,
            scannedValue,
          })
        ) {
          console.log('in dependencies');
          console.log('currentValue', currentValue);
          console.log('scannedValue', scannedValue);

          updatedProductDirectory[productId][
            productDirectoryProps[attribute]
          ] = scannedValue.join(',');
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
