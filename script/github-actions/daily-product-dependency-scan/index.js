const glob = require('glob');
const fs = require('fs');

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
      // this comparison will fail
      if (
        fields[productDirectory.headings.packageDependencyIndex] !==
        products.all[productId].packageDependencies
      ) {
        dependenciesChanged = true;
        fields[productDirectory.headings.packageDependencyIndex] =
          products.all[productId].packageDependencies;
      }

      // this comparison will fail
      if (
        fields[productDirectory.headings.crossProductDependencyIndex] !==
        products.all[productId].crossProductDependencies
      ) {
        dependenciesChanged = true;
        fields[productDirectory.headings.crossProductDependencyIndex] =
          products.all[productId].crossProductDependencies;
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
