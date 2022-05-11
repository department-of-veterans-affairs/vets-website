/* eslint-disable class-methods-use-this */
const _ = require('lodash');

class Differ {
  constructor({ emptyProductCsv }) {
    this.updatedProductDirectory = emptyProductCsv;
    this.changeDetected = false;
  }

  diff({ products, productCsv }) {
    productCsv.rows.all.forEach(row => {
      const fields = row.split(';');
      const productId = fields[0];

      if (products.all[productId]) {
        // TODO break the following out into different compare functions (see below)
        // TODO add compare functions for test types and product path (see below)
        /*
        Compare package dependencies for given product
        */
        const { packageDependencyIndex } = productCsv.headings;
        let csvPackageDependencies = fields[packageDependencyIndex]
          .replace(/"/g, '')
          .split(',');
        csvPackageDependencies =
          csvPackageDependencies[0] === '' ? [] : csvPackageDependencies;

        const scannedPackageDependencies = Array.from(
          products.all[productId].packageDependencies,
        );

        if (!_.isEqual(csvPackageDependencies, scannedPackageDependencies)) {
          this.changeDetected = true;

          if (scannedPackageDependencies.length > 0) {
            fields[
              packageDependencyIndex
            ] = `"${scannedPackageDependencies.join(',')}"`;
          } else {
            fields[packageDependencyIndex] = '';
          }
        }
        /*
        Compare cross product dependencies for given product
        */
        const { crossProductDependencyIndex } = productCsv.headings;

        let csvCrossProductDependencies = fields[crossProductDependencyIndex]
          .replace(/"/g, '')
          .split(',');
        csvCrossProductDependencies =
          csvCrossProductDependencies[0] === ''
            ? []
            : csvCrossProductDependencies;

        const scannedCrossProductDependencies = Array.from(
          products.all[productId].crossProductDependencies,
        );

        if (
          !_.isEqual(
            csvCrossProductDependencies,
            scannedCrossProductDependencies,
          )
        ) {
          this.changeDetected = true;

          if (scannedCrossProductDependencies.length > 0) {
            fields[
              crossProductDependencyIndex
            ] = `"${scannedCrossProductDependencies.join(',')}"`;
          } else {
            fields[crossProductDependencyIndex] = '';
          }
        }
      }

      const updatedRow = fields.join(',');
      this.updatedProductDirectory.rows.all.push(updatedRow);
    });
  }

  compareProductPath() {
    // TODO implement
  }

  comparePackageDependencies() {
    // TODO implement
  }

  compareCrossProductDependencies() {
    // TODO implement
  }

  compareHasUnitTests() {
    // TODO implement
  }

  compareHasE2eTests() {
    // TODO implement
  }

  compareHasContractTests() {
    // TODO implement
  }
}

module.exports = Differ;
