const findImports = require('../../../../utils/find-imports-lite');

const Dependencies = require('.');

class PackageDependencies extends Dependencies {
  constructor({ products }) {
    super({ products });
  }

  setDependencies() {
    Object.values(this.products).forEach(product => {
      const imports = findImports(`${product.pathToCode}/**/*.{js,jsx}`, {
        absoluteImports: false,
        relativeImports: false,
        packageImports: true,
      });

      Object.values(imports).forEach(dependencies => {
        if (dependencies.length === 0) return;

        dependencies.forEach(dependency => {
          product.packageDependencies.add(dependency);
        });
      });
    });
  }
}

module.exports = PackageDependencies;
