/* eslint-disable no-param-reassign */
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
      const product = products.all[productId];

      if (product) {
        this.compareAttribute({
          attribute: product.productPath,
          index: productCsv.headings.pathToCodeIndex,
          fields,
        });

        this.compareAttribute({
          attribute: product.hasUnitTests,
          index: productCsv.headings.hasUnitTestsIndex,
          fields,
        });

        this.compareAttribute({
          attribute: product.hasE2eTests,
          index: productCsv.headings.hasE2eTestsIndex,
          fields,
        });

        this.compareAttribute({
          attribute: product.hasContractTests,
          index: productCsv.headings.hasContractTestsIndex,
          fields,
        });

        /*
        Compare package dependencies for given product
        */
        this.comparePackageDependencies({
          attribute: product.packageDependencies,
          index: productCsv.headings.packageDependencyIndex,
          fields,
        });
        // const { packageDependencyIndex } = productCsv.headings;
        // let csvPackageDependencies = fields[packageDependencyIndex]
        //   .replace(/"/g, '')
        //   .split(',');
        // csvPackageDependencies =
        //   csvPackageDependencies[0] === '' ? [] : csvPackageDependencies;

        // const scannedPackageDependencies = Array.from(
        //   product.packageDependencies,
        // );

        // if (!_.isEqual(csvPackageDependencies, scannedPackageDependencies)) {
        //   this.changeDetected = true;

        //   if (scannedPackageDependencies.length > 0) {
        //     fields[
        //       packageDependencyIndex
        //     ] = `"${scannedPackageDependencies.join(',')}"`;
        //   } else {
        //     fields[packageDependencyIndex] = '';
        //   }
        // }
        /*
        Compare cross product dependencies for given product
        */
        this.compareCrossProductDependencies({
          attribute: product.crossProductDependencies,
          index: productCsv.headings.crossProductDependenciesIndex,
          fields,
        });
        //   const { crossProductDependencyIndex } = productCsv.headings;

        //   let csvCrossProductDependencies = fields[crossProductDependencyIndex]
        //     .replace(/"/g, '')
        //     .split(',');
        //   csvCrossProductDependencies =
        //     csvCrossProductDependencies[0] === ''
        //       ? []
        //       : csvCrossProductDependencies;

        //   const scannedCrossProductDependencies = Array.from(
        //     product.crossProductDependencies,
        //   );

        //   if (
        //     !_.isEqual(
        //       csvCrossProductDependencies,
        //       scannedCrossProductDependencies,
        //     )
        //   ) {
        //     this.changeDetected = true;

        //     if (scannedCrossProductDependencies.length > 0) {
        //       fields[
        //         crossProductDependencyIndex
        //       ] = `"${scannedCrossProductDependencies.join(',')}"`;
        //     } else {
        //       fields[crossProductDependencyIndex] = '';
        //     }
        //   }
      }

      const updatedRow = fields.join(',');
      this.updatedProductDirectory.rows.all.push(updatedRow);
    });
  }

  compareAttribute({ attribute, index, fields }) {
    if (fields[index] !== attribute) {
      this.changeDetected = true;
      fields[index] = attribute;
    }
  }

  comparePackageDependencies({ attribute, index, fields }) {
    let csvPackageDependencies = fields[index].replace(/"/g, '').split(',');
    csvPackageDependencies =
      csvPackageDependencies[0] === '' ? [] : csvPackageDependencies;

    const scannedPackageDependencies = Array.from(attribute);

    if (!_.isEqual(csvPackageDependencies, scannedPackageDependencies)) {
      this.changeDetected = true;

      if (scannedPackageDependencies.length > 0) {
        fields[index] = `"${scannedPackageDependencies.join(',')}"`;
      } else {
        fields[index] = '';
      }
    }
  }

  compareCrossProductDependencies({ attribute, index, fields }) {
    let csvCrossProductDependencies = fields[index]
      .replace(/"/g, '')
      .split(',');
    csvCrossProductDependencies =
      csvCrossProductDependencies[0] === '' ? [] : csvCrossProductDependencies;

    const scannedCrossProductDependencies = Array.from(attribute);

    if (
      !_.isEqual(csvCrossProductDependencies, scannedCrossProductDependencies)
    ) {
      this.changeDetected = true;

      if (scannedCrossProductDependencies.length > 0) {
        fields[index] = `"${scannedCrossProductDependencies.join(',')}"`;
      } else {
        fields[index] = '';
      }
    }
  }
}

module.exports = Differ;
