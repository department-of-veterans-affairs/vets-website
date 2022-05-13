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
    const fieldValueAsBoolean =
      fields[fieldIndex] === 'true' || fields[fieldIndex] === 'TRUE';

    if (fieldValueAsBoolean === boolean) return;

    this.changeDetected = true;
    fields[fieldIndex] = boolean;
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
}

module.exports = Differ;
