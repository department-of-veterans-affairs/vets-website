/* eslint-disable no-console */
const glob = require('glob');
const core = require('@actions/core');

const Products = require('./products');
const PackageDependencies = require('./products/dependencies/package-dependencies');
const CrossProductDependencies = require('./products/dependencies/cross-product-dependencies');
const TestTypes = require('./products/test-types');
const Csv = require('./csv');
const Headings = require('./csv/headings');
const Rows = require('./csv/rows');
const Differ = require('./csv/differ');
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

function handleSuccess({ changeDetected, message, data }) {
  core.exportVariable('CHANGE_DETECTED', changeDetected);

  return {
    status: 'Success',
    changeDetected,
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

  const testTypes = new TestTypes({ products: products.all });
  testTypes.checkExistance();

  let response = await octokit.getProductCsv();

  if (response?.status !== 200) {
    return handleFailure({ response });
  }

  const { data: csv } = response;
  const csvLines = removeCarriageReturn(transformCsvToScsv(csv).split('\n'));
  const emptyProductCsv = new Csv({
    headings: new Headings({ csvLine: csvLines.slice(0, 1)[0] }),
    rows: new Rows({ csvLines: [] }),
  });
  const productCsv = new Csv({
    headings: new Headings({ csvLine: csvLines.slice(0, 1)[0] }),
    rows: new Rows({ csvLines: csvLines.slice(1) }),
  });
  const differ = new Differ({ emptyProductCsv });
  differ.diff({ products, productCsv });

  const updatedCsv = emptyProductCsv.generateOutput();
  const { changeDetected } = differ;

  if (!changeDetected) {
    return handleSuccess({
      changeDetected,
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
    changeDetected,
    message:
      'Dependency changes were detected. The data prop includes the updated CSV.',
    data: updatedCsv,
  });
}

module.exports = main;
