/* eslint-disable no-console */
const core = require('@actions/core');
const fs = require('fs');

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
  const response = await octokit.getProductJson();

  if (response?.status !== 200) {
    return handleFailure({ response });
  }
  const productDirectory = JSON.parse(response.data);

  const productPaths = productDirectory.map(product => ({
    productId: product.product_id,
    pathToCode: product.path_to_code,
  }));

  products.addProducts({
    productPaths,
  });

  new PackageDependencies({
    products: products.all,
  }).setDependencies();

  new CrossProductDependencies({
    products: products.all,
  }).setDependencies();

  const testTypes = new TestTypes({ products: products.all });
  testTypes.checkExistance();

  const lastUpdated = new LastUpdated({ products: products.all });
  await lastUpdated.setLastUpdated();

  // Check for automatically updated field values
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

  fs.writeFileSync(
    'product-directory/product-directory.json',
    updatedProductDirectory,
  );

  return handleSuccess({
    changeDetected,
    message: 'Changes were detected. The data prop includes the updated CSV.',
    data: updatedProductDirectory,
  });
}

module.exports = main;
