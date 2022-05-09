const findImports = require('find-imports');

const Dependencies = require('.');

class PackageDependencies extends Dependencies {
  constructor({ products }) {
    super({ products });
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
