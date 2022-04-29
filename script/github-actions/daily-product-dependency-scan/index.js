const glob = require('glob');
const fs = require('fs');
const _ = require('lodash');

const Products = require('./products');
const PackageDependencies = require('./package-dependencies');
const CrossProductDependencies = require('./cross-product-dependencies');
const Csv = require('./csv');
const Headings = require('./csv/headings');
const Rows = require('./csv/rows');
const { removeCarriageReturn, transformCsvToScsv } = require('./csv/helpers');

async function main() {
  const products = new Products();

  products.addProducts({
    manifestPaths: glob.sync('src/applications/**/*manifest.json'),
  });

  const packageDependencies = new PackageDependencies({
    products: products.all,
  });
  packageDependencies.setDependencies();

  const crossProductDependencies = new CrossProductDependencies({
    products: products.all,
  });
  crossProductDependencies.setDependencies();

  // refactor the following after the code runs
  const csv = await fs.promises.readFile(
    `${
      process.env.PWD
    }/script/github-actions/daily-product-dependency-scan/product-directory.csv`,
    'utf8',
  );

  const csvLines = removeCarriageReturn(transformCsvToScsv(csv).split('\n'));

  const productDirectory = new Csv({
    headings: new Headings({ csvLine: csvLines.slice(0, 1)[0] }),
    rows: new Rows({ csvLines: csvLines.slice(1) }),
  });

  const newCsv = [`${productDirectory.headings.all.join(',')}`];
  let dependenciesChanged = false;

  productDirectory.rows.all.forEach(row => {
    const fields = row.split(';');
    const productId = fields[0];

    if (products.all[productId]) {
      // compare package dependencies
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
        dependenciesChanged = true;

        if (scannedPackageDependencies.length > 0) {
          fields[packageDependencyIndex] = `"${scannedPackageDependencies.join(
            ',',
          )}"`;
        } else {
          fields[packageDependencyIndex] = '';
        }
      }

      // compare cross product imports
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
        !_.isEqual(csvCrossProductDependencies, scannedCrossProductDependencies)
      ) {
        dependenciesChanged = true;

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
    newCsv.push(updatedRow);
  });

  // eslint-disable-next-line no-console
  console.log('dependenciesChanged: ', dependenciesChanged);

  if (dependenciesChanged) {
    // submit pr

    // delete the following before submitting pr
    // eslint-disable-next-line func-names
    fs.writeFileSync(
      'updated-product-directory.csv',
      newCsv.join('\n'),
      // eslint-disable-next-line func-names
      function(err) {
        if (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      },
    );
  }
}

main();
