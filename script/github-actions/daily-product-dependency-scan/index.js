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

  products.swapKeys();

  // refactor the following after the code runs
  const csv = await fs.promises.readFile(
    `${process.env.PWD}/product-directory.csv`,
    'utf8',
  );

  const csvLines = removeCarriageReturn(transformCsvToScsv(csv).split('\n'));

  const productDirectory = new Csv({
    headings: new Headings({ csvLine: csvLines.slice(0, 1) }),
    rows: new Rows({ csvLines: csvLines.slice(1) }),
  });

  const newCsv = [];
  let dependenciesChanged = false;

  productDirectory.rows.forEach(row => {
    const fields = row.split(';');
    const productId = fields[0];

    if (products.all[productId]) {
      // compare package dependencies
      const { packageDependencyIndex } = productDirectory.headings;
      const csvPackageDependencies = fields[packageDependencyIndex].split(',');
      const scannedPackageDependencies = Array.from(
        products.all[productId].packageDependencies,
      );

      if (!_.isEqual(csvPackageDependencies, scannedPackageDependencies)) {
        dependenciesChanged = true;
        fields[packageDependencyIndex] = scannedPackageDependencies.join(',');
      }

      // compare cross product imports
      const { crossProductDependencyIndex } = productDirectory.headings;
      const csvCrossProductDependencies = fields[
        crossProductDependencyIndex
      ].split(',');
      const scannedCrossProductDependencies = Array.from(
        products.all[productId].crossProductDependencies,
      );

      if (
        !_.isEqual(csvCrossProductDependencies, scannedCrossProductDependencies)
      ) {
        dependenciesChanged = true;
        fields[
          crossProductDependencyIndex
        ] = scannedCrossProductDependencies.join(',');
      }
    }

    const updatedRow = `${fields.join(',')}\n\r`;
    newCsv.push(updatedRow);
  });

  if (dependenciesChanged) {
    // eslint-disable-next-line no-console
    console.log(newCsv);
    // submit pr
  }
}

main();
