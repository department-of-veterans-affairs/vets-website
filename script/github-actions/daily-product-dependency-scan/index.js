/* eslint-disable no-console */
const glob = require('glob');
const core = require('@actions/core');

const GitHub = require('./github');
const Products = require('./products');
const PackageDependencies = require('./package-dependencies');
const CrossProductDependencies = require('./cross-product-dependencies');
const DependencyDiffer = require('./dependency-differ');
const Csv = require('./csv');
const Headings = require('./csv/headings');
const Rows = require('./csv/rows');
const { removeCarriageReturn, transformCsvToScsv } = require('./csv/helpers');

function handleFailure({ response }) {
  if (response.status) {
    console.log(`GitHub API response:\n${response}`);
  } else {
    console.log(`Error:\n${response}`);
  }

  core.setFailed(
    'Product dependencies have changed but there was an error when trying to submit a PR to update the Product Directory.',
  );
}

async function main() {
  const products = new Products();

  products.addProducts({
    manifestPaths: glob.sync('src/applications/**/*manifest.json'),
  });

  new PackageDependencies({
    products: products.all,
  }).setDependencies();

  new CrossProductDependencies({
    products: products.all,
  }).setDependencies();

  const octokit = new GitHub();
  let response = await octokit.getProductDirectory();

  if (response.status === 200) {
    const { data: csv } = response;
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
    dependencyDiffer.diff({ products, productDirectory });

    if (dependencyDiffer.dependenciesChanged) {
      response = await octokit.createPull({
        content: emptyProductDirectory.generateOutput(),
      });

      if (response.status === 201) {
        console.log(
          'Product dependencies have changed. A PR to update the Product Directory has been submitted.',
        );
      } else {
        handleFailure(response);
      }
    }
  } else {
    handleFailure(response);
  }
}

main();
