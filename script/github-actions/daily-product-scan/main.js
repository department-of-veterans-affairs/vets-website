/* eslint-disable no-console */
const glob = require('glob');
const core = require('@actions/core');

const Products = require('./products');
const PackageDependencies = require('./products/dependencies/package-dependencies');
const CrossProductDependencies = require('./products/dependencies/cross-product-dependencies');
const TestTypes = require('./products/test-types');
const LastUpdated = require('./products/last-updated');
const Differ = require('./json/differ');

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

  // only update last_updated when GitHub Actions workflow runs for now
  if (process.env.MANIFEST_GLOB_PATH) {
    const lastUpdated = new LastUpdated({ products: products.all });
    lastUpdated.setLastUpdated();
  }

  let response = await octokit.getProductJson();

  if (response?.status !== 200) {
    return handleFailure({ response });
  }

  const productDirectory = JSON.parse(response.data);

  const differ = new Differ();
  const updatedProductDirectory = differ.diff({
    products,
    currentProductDirectory: productDirectory,
  });

  const { changeDetected } = differ;

  if (!changeDetected) {
    return handleSuccess({
      changeDetected,
      message:
        'No changes were detected. The data prop includes the unchanged CSV.',
      data: updatedProductDirectory,
    });
  }

  response = await octokit.createPull({
    content: updatedProductDirectory,
  });

  if (response?.status !== 201) {
    return handleFailure({ response });
  }

  return handleSuccess({
    changeDetected,
    message: 'Changes were detected. The data prop includes the updated CSV.',
    data: updatedProductDirectory,
  });
}

module.exports = main;
