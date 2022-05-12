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
        this.comparePathToCode({
          path: product.pathToCode,
          fieldIndex: productCsv.headings.pathToCodeIndex,
          fields,
        });

        ['hasUnitTests', 'hasE2eTests', 'hasContractTests'].forEach(
          attribute => {
            this.compareBooleanAttribute({
              boolean: product[attribute],
              fieldIndex: productCsv.headings[`${attribute}Index`],
              fields,
            });
          },
        );

        ['packageDependencies', 'crossProductDependencies'].forEach(
          attribute => {
            this.compareDependencies({
              dependencies: product[attribute],
              fieldIndex: productCsv.headings[`${attribute}Index`],
              fields,
            });
          },
        );
      }

      const updatedRow = fields.join(',');
      this.updatedProductCsv.rows.all.push(updatedRow);
    });
  }

  comparePathToCode({ path, fieldIndex, fields }) {
    if (fields[fieldIndex] !== path) {
      this.changeDetected = true;
      fields[fieldIndex] = path;
    }
  }

  compareBooleanAttribute({ boolean, fieldIndex, fields }) {
    const lowerCaseBoolean = boolean.toString();
    const upperCaseBoolean = lowerCaseBoolean.toUpperCase();

    if (
      fields[fieldIndex] !== lowerCaseBoolean ||
      fields[fieldIndex] !== upperCaseBoolean
    ) {
      this.changeDetected = true;
      fields[fieldIndex] = boolean;
    }
  }

  compareDependencies({ dependencies, fieldIndex, fields }) {
    let csvDependencies = fields[fieldIndex].replace(/"/g, '').split(',');
    csvDependencies = csvDependencies[0] === '' ? [] : csvDependencies;

    const scannedDependencies = Array.from(dependencies);

    if (!_.isEqual(csvDependencies, scannedDependencies)) {
      this.changeDetected = true;

      if (scannedDependencies.length > 0) {
        fields[fieldIndex] = `"${scannedDependencies.join(',')}"`;
      } else {
        fields[fieldIndex] = '';
      }
    }
  }

  // comparePackageDependencies({ attribute, index, fields }) {
  //   let csvPackageDependencies = fields[index].replace(/"/g, '').split(',');
  //   csvPackageDependencies =
  //     csvPackageDependencies[0] === '' ? [] : csvPackageDependencies;

  //   const scannedPackageDependencies = Array.from(attribute);

  //   if (!_.isEqual(csvPackageDependencies, scannedPackageDependencies)) {
  //     this.changeDetected = true;

  //     if (scannedPackageDependencies.length > 0) {
  //       fields[index] = `"${scannedPackageDependencies.join(',')}"`;
  //     } else {
  //       fields[index] = '';
  //     }
  //   }
  // }

  // compareCrossProductDependencies({ attribute, index, fields }) {
  //   let csvCrossProductDependencies = fields[index]
  //     .replace(/"/g, '')
  //     .split(',');
  //   csvCrossProductDependencies =
  //     csvCrossProductDependencies[0] === '' ? [] : csvCrossProductDependencies;

  //   const scannedCrossProductDependencies = Array.from(attribute);

  //   if (
  //     !_.isEqual(csvCrossProductDependencies, scannedCrossProductDependencies)
  //   ) {
  //     this.changeDetected = true;

  //     if (scannedCrossProductDependencies.length > 0) {
  //       fields[index] = `"${scannedCrossProductDependencies.join(',')}"`;
  //     } else {
  //       fields[index] = '';
  //     }
  //   }
  // }
}

module.exports = Differ;
