/* eslint-disable no-param-reassign */
const _ = require('lodash');

const headingNames = require('./heading-names');

class Differ {
  constructor({ emptyProductCsv }) {
    this.updatedProductCsv = emptyProductCsv;
    this.changeDetected = false;
  }

  diff({ products, productCsv }) {
    productCsv.rows.all.forEach(row => {
      const fields = row.split(';');
      const productId = fields[0];
      const product = products.all[productId];

      if (product) {
        Object.values(headingNames)
          .map(name => _.snakeCase(name))
          .forEach(name => {
            this.compareAttribute({
              attribute: product[name],
              index: productCsv.headings[`${name}Index`],
              fields,
            });
          });

        this.comparePackageDependencies({
          attribute: product.packageDependencies,
          index: productCsv.headings.packageDependencyIndex,
          fields,
        });

        this.compareCrossProductDependencies({
          attribute: product.crossProductDependencies,
          index: productCsv.headings.crossProductDependenciesIndex,
          fields,
        });
      }

      const updatedRow = fields.join(',');
      this.updatedProductCsv.rows.all.push(updatedRow);
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
