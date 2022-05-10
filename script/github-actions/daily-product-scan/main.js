/* eslint-disable no-console */
const glob = require('glob');
const core = require('@actions/core');

const Products = require('./products');
const PackageDependencies = require('./products/dependencies/package-dependencies');
const CrossProductDependencies = require('./products/dependencies/cross-product-dependencies');
const DependencyDiffer = require('./products/dependencies/dependency-differ');
const Csv = require('./csv');
const Headings = require('./csv/headings');
const Rows = require('./csv/rows');
const { removeCarriageReturn, transformCsvToScsv } = require('./csv/helpers');

function handleFailure({ response }) {
  core.setFailed(
    'There was an error running this job. Please see the logs for more information.',
  );

  return {
    status: 'Failure',
    message: response?.status
      ? 'There was an error with GitHub.'
      : 'An unkown error occured.',
    data: JSON.stringify(response, null, 2),
  };
}

function handleSuccess({ changesDetected, message, data }) {
  if (changesDetected) {
    console.log(
      'Product dependencies have changed. A PR to update the Product Directory has been submitted.',
    );
  } else {
    console.log('No dependency changes were detected.');
  }

  core.exportVariable('CHANGES_DETECTED', changesDetected);

  return {
    status: 'Success',
    changesDetected,
    message,
    data,
  };
}

async function main({ octokit }) {
  const products = new Products();
  const manifestGlobPathForTests =
    'script/github-actions/daily-product-scan/tests/mocks/applications/**/*manifest.json';
  const manifestGlobPath =
    process.env.MANIFEST_GLOB_PATH || manifestGlobPathForTests;

  products.addProducts({
    manifestPaths: glob.sync(manifestGlobPath),
  });

  new PackageDependencies({
    products: products.all,
  }).setDependencies();

  new CrossProductDependencies({
    products: products.all,
  }).setDependencies();

  let response = await octokit.getProductDirectory();

  if (response?.status !== 200) {
    return handleFailure({ response });
  }

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

  const updatedCsv = emptyProductDirectory.generateOutput();

  if (!dependencyDiffer.dependenciesChanged) {
    return handleSuccess({
      changesDetected: false,
      message:
        'No dependency changes were detected. The data prop includes the unchanged CSV.',
      data: updatedCsv,
    });
  }

  response = await octokit.createPull({
    content: updatedCsv,
  });

  if (response?.status !== 201) {
    return handleFailure({ response });
  }

  return handleSuccess({
    changesDetected: true,
    message:
      'Dependency changes were detected. The data prop includes the updated CSV.',
    data: updatedCsv,
  });
}

module.exports = main;
