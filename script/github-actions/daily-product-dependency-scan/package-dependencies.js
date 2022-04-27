// const findImports = require('find-imports');
// const fs = require('fs');
// const glob = require('glob');

// const manifestPaths = glob.sync('src/applications/**/*manifest.json');
// const productMeta = {};

// manifestPaths.forEach(path => {
//   const manifest = JSON.parse(fs.readFileSync(path));
//   const { productId } = manifest;

//   if (productId) {
//     const productPath = path.slice(0, path.lastIndexOf('/'));

//     productMeta[productPath] = {
//       productId,
//       productPath,
//       dependancies: new Set(),
//       crossProductImports: new Set(),
//     };
//   }
// });

// Object.values(productMeta).forEach(product => {
//   const imports = findImports(`${product.productPath}/**/*.{js,jsx}`, {
//     absoluteImports: false,
//     relativeImports: false,
//     packageImports: true,
//   });

//   Object.values(imports).forEach(dependancies => {
//     if (dependancies.length === 0) return;

//     dependancies.forEach(dependency => {
//       product.dependancies.add(dependency);
//     });
//   });
// });
