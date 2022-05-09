const _ = require('lodash');

class DependencyDiffer {
  constructor({ emptyProductDirectory }) {
    this.updatedProductDirectory = emptyProductDirectory;
    this.dependenciesChanged = false;
  }

  diff({ products, productDirectory }) {
    productDirectory.rows.all.forEach(row => {
      const fields = row.split(';');
      const productId = fields[0];

      if (products.all[productId]) {
        /*
        Compare package dependencies for given product
        */
        const { packageDependencyIndex } = productDirectory.headings;
        let csvPackageDependencies = fields[packageDependencyIndex]
          .replace(/"/g, '')
          .split(',');
        csvPackageDependencies =
          csvPackageDependencies[0] === '' ? [] : csvPackageDependencies;

        const scannedPackageDependencies = Array.from(
          products.all[productId].packageDependencies,
        );

        if (!_.isEqual(csvPackageDependencies, scannedPackageDependencies)) {
          this.dependenciesChanged = true;

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
        const { crossProductDependencyIndex } = productDirectory.headings;

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
          this.dependenciesChanged = true;

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
}

module.exports = DependencyDiffer;
