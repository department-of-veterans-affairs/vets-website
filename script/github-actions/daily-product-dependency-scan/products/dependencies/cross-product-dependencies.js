/* eslint-disable class-methods-use-this */
const findImports = require('find-imports');

const Dependencies = require('.');

class CrossProductDependencies extends Dependencies {
  constructor({ products }) {
    super({ products });
  }

  setDependencies() {
    Object.keys(this.products).forEach(productId => {
      const { productPath } = this.products[productId];
      const imports = findImports(`${productPath}/**/*.*`, {
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

          if (
            this.importIsFromOtherProduct({ productPath, importedFilePath })
          ) {
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
    const productDirectory = '/src/applications/';
    const testProductDirectory =
      'script/github-actions/daily-product-dependency-scan/tests/mocks/applications/';

    return !(
      importedFilePath.startsWith(productDirectory) ||
      importedFilePath.startsWith(testProductDirectory)
    );
  }

  // TODO: fix this function
  importIsFromOtherProduct({ productPath, importedFilePath }) {
    // console.log('compare productPath with importedFilePath');
    // console.log(productPath);
    // console.log(importedFilePath);
    // console.log('');

    // handle the following paths which cause this function to incorrectly return true:
    // script/github-actions/daily-product-dependency-scan/tests/mocks/applications/app-2/app-2a
    // /src/applications/vre/28-1900/components/PreSubmitInfo

    const parentDirectory = productPath
      .split('/')
      .slice(0, 3)
      .join('/');

    // return !importedFilePath.startsWith(parentDirectory);
    return !importedFilePath.includes(parentDirectory);
  }

  setDependency({ productId, importedFilePath }) {
    this.products[productId].crossProductDependencies.add(importedFilePath);
  }
}

module.exports = CrossProductDependencies;
