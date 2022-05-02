const glob = require('glob');

const GitHub = require('./github');
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

  const octokit = new GitHub();
  const response = await octokit.getProductDirectory();

  if (response.status === 200) {
    const csv = response.data;
    const csvLines = removeCarriageReturn(transformCsvToScsv(csv).split('\n'));

    const emptyProductDirectory = new Csv({
      headings: new Headings({ csvLine: csvLines.slice(0, 1)[0] }),
      rows: new Rows({ csvLines: [] }),
    });

    const productDirectory = new Csv({
      headings: new Headings({ csvLine: csvLines.slice(0, 1)[0] }),
      rows: new Rows({ csvLines: csvLines.slice(1) }),
    });

    const dependencyDiffer = new DependencyDiffer({ emptyProductDirectory });
    dependencyDiffer.diff({ productDirectory });

    // if (dependencyDiffer.dependenciesChanged) {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      const { status } = await octokit.createRef();
      if (status === 201) {
        // commit file
        // submit pr
      }
    }
  } else {
    // fail
  }
}

main();
