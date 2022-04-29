const glob = require('glob');
const fs = require('fs');

const Products = require('./products');
const PackageDependencies = require('./package-dependencies');
const CrossProductDependencies = require('./cross-product-dependencies');
const DependencyDiffer = require('./dependency-differ');
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

  const csv = await fs.promises.readFile(
    `${
      process.env.PWD
    }/script/github-actions/daily-product-dependency-scan/product-directory.csv`,
    'utf8',
  );

  const csvLines = removeCarriageReturn(transformCsvToScsv(csv).split('\n'));

  const dependencyDiffer = new DependencyDiffer({
    emptyProductDirectory: new Csv({
      headings: new Headings({ csvLine: csvLines.slice(0, 1)[0] }),
      rows: new Rows({ csvLines: [] }),
    }),
  });

  dependencyDiffer.diff({
    products,
    productDirectory: new Csv({
      headings: new Headings({ csvLine: csvLines.slice(0, 1)[0] }),
      rows: new Rows({ csvLines: csvLines.slice(1) }),
    }),
  });

  // eslint-disable-next-line no-console
  console.log('dependenciesChanged: ', dependencyDiffer.dependenciesChanged);

  if (dependencyDiffer.dependenciesChanged) {
    // submit pr

    // delete the following before submitting pr
    // eslint-disable-next-line func-names
    fs.writeFileSync(
      'updated-product-directory.csv',
      dependencyDiffer.updatedProductDirectory.generateOutput(),

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
