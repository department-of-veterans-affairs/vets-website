const glob = require('glob');

const Products = require('./products');
const PackageDependencies = require('./package-dependencies');
const CrossProductDependencies = require('./cross-product-dependencies');

function main() {
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
}

main();
