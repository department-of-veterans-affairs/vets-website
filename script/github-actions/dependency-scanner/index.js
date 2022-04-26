const findImports = require('find-imports');
const fs = require('fs');
const glob = require('glob');

const manifestPaths = glob.sync('src/applications/**/*manifest.json');
const productMeta = {};

manifestPaths.forEach(path => {
  const manifest = JSON.parse(fs.readFileSync(path));

  // only include manifests with product ids for now
  if (manifest.productId) {
    productMeta[manifest.productId] = {
      path: path.slice(0, path.lastIndexOf('/')),
      dependancies: new Set(),
      crossProductImports: new Set(),
    };
  }
});

Object.keys(productMeta).forEach(id => {
  const product = productMeta[id];

  const imports = findImports(`${product.path}/**/*.{js,jsx}`, {
    absoluteImports: false,
    relativeImports: false,
    packageImports: true,
  });

  Object.values(imports).forEach(dependancies => {
    if (dependancies.length === 0) return;

    dependancies.forEach(dependency => {
      product.dependancies.add(dependency);
    });
  });
});
