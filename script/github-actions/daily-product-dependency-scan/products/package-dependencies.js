const findImports = require('find-imports');

class PackageDependencies {
  constructor({ products }) {
    this.products = products;
  }

  setDependencies() {
    Object.values(this.products).forEach(product => {
      const imports = findImports(`${product.productPath}/**/*.{js,jsx}`, {
        absoluteImports: false,
        relativeImports: false,
        packageImports: true,
      });

      Object.values(imports).forEach(dependancies => {
        if (dependancies.length === 0) return;

        dependancies.forEach(dependency => {
          product.packageDependencies.add(dependency);
        });
      });
    });
  }
}

module.exports = PackageDependencies;
