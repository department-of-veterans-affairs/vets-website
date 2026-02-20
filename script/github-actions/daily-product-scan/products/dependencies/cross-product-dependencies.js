/* eslint-disable class-methods-use-this */
const findImports = require('../../../../utils/find-imports-lite');

const Dependencies = require('.');

class CrossProductDependencies extends Dependencies {
  constructor({ products }) {
    super({ products });
  }

  setDependencies() {
    Object.keys(this.products).forEach(productId => {
      const { pathToCode } = this.products[productId];
      const imports = findImports(`${pathToCode}/**/*.*`, {
        absoluteImports: true,
        relativeImports: true,
        packageImports: false,
      });

      Object.keys(imports).forEach(importerFilePath => {
        imports[importerFilePath].forEach(importRef => {
          const importedFilePath = this.getImportPath({
            importerFilePath,
            importRef,
          });

          if (this.importIsNotFromAnyProductDirectory({ importedFilePath })) {
            return;
          }

          if (this.importIsFromOtherProduct({ pathToCode, importedFilePath })) {
            this.setDependency({
              productId,
              importedFilePath,
            });
          }
        });
      });
    });
  }

  getImportPath({ importerFilePath, importRef }) {
    const filePathAsArray = importerFilePath.split('/');

    if (importRef === '.') {
      return `${importerFilePath.slice(
        0,
        importerFilePath.lastIndexOf('/'),
      )}/index.js`;
    }

    if (importRef.startsWith('./')) {
      return (
        importerFilePath.slice(0, importerFilePath.lastIndexOf('/')) +
        importRef.slice(1)
      );
    }

    if (importRef.startsWith('../')) {
      const numDirsUp = importRef.split('/').filter(str => str === '..').length;

      return importRef.replace(
        '../'.repeat(numDirsUp),
        `${filePathAsArray
          .slice(0, filePathAsArray.length - 1 - numDirsUp)
          .join('/')}/`,
      );
    }

    return importRef;
  }

  importIsNotFromAnyProductDirectory({ importedFilePath }) {
    const productDirectory = 'src/applications/';
    const testProductDirectory =
      'script/github-actions/daily-product-dependency-scan/tests/mocks/applications/';

    return !(
      importedFilePath.includes(productDirectory) ||
      importedFilePath.includes(testProductDirectory)
    );
  }

  importIsFromOtherProduct({ pathToCode, importedFilePath }) {
    const parentDirectory = pathToCode
      .split('/')
      .slice(0, 3)
      .join('/');

    return !importedFilePath.includes(parentDirectory);
  }

  setDependency({ productId, importedFilePath }) {
    this.products[productId].crossProductDependencies.add(importedFilePath);
  }
}

module.exports = CrossProductDependencies;
