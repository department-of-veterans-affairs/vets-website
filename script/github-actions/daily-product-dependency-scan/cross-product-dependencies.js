/* eslint-disable class-methods-use-this */
const findImports = require('find-imports');

class CrossProductDependencies {
  constructor({ products }) {
    this.products = products;
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

          if (
            importedFilePath.startsWith('src/platform') ||
            importedFilePath.startsWith('src/site')
          )
            return;

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

  importIsFromOtherProduct({ productPath, importedFilePath }) {
    const parentDirectory = productPath
      .split('/')
      .slice(0, 3)
      .join('/');

    return !importedFilePath.startsWith(parentDirectory);
  }

  setDependency({ productId, importedFilePath }) {
    this.products[productId].crossProductDependencies.add(importedFilePath);
  }
}

module.exports = CrossProductDependencies;
