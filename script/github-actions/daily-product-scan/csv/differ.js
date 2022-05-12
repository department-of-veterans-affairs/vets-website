/* eslint-disable no-param-reassign */
const _ = require('lodash');

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
        ['hasUnitTests', 'hasE2eTests', 'hasContractTests'].forEach(
          attribute => {
            this.compareBooleanAttribute({
              boolean: product[attribute],
              index: productCsv.headings[`${attribute}Index`],
              fields,
            });
          },
        );

        this.comparePathToCode({
          path: product.pathToCode,
          index: productCsv.headings.pathToCodeIndex,
          fields,
        });

        this.comparePackageDependencies({
          attribute: product.packageDependencies,
          index: productCsv.headings.packageDependencyIndex,
          fields,
        });

        this.compareCrossProductDependencies({
          attribute: product.crossProductDependencies,
          index: productCsv.headings.crossProductDependencyIndex,
          fields,
        });
      }

      const updatedRow = fields.join(',');
      this.updatedProductCsv.rows.all.push(updatedRow);
    });
  }

  compareBooleanAttribute({ boolean, index, fields }) {
    const lowerCaseBoolean = boolean.toString();
    const upperCaseBoolean = lowerCaseBoolean.toUpperCase();

    if (
      fields[index] !== lowerCaseBoolean ||
      fields[index] !== upperCaseBoolean
    ) {
      this.changeDetected = true;
      fields[index] = boolean;
    }
  }

  comparePathToCode({ path, index, fields }) {
    if (fields[index] !== path) {
      this.changeDetected = true;
      fields[index] = path;
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
