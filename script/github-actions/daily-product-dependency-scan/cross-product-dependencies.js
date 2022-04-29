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
          const importeeFilePath = this.getImportPath({
            importerFilePath,
            importRef,
          });

          if (
            importeeFilePath.startsWith('src/platform') ||
            importeeFilePath.startsWith('src/site')
          )
            return;

          if (
            this.importIsFromOtherProduct({ productPath, importeeFilePath })
          ) {
            this.setDependency({
              productId,
              importeeFilePath,
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

  importIsFromOtherProduct({ productPath, importeeFilePath }) {
    const parentDirectory = importeeFilePath
      .split('/')
      .slice(0, 3)
      .join('/');

    return !(
      importeeFilePath.startsWith(parentDirectory) ||
      importeeFilePath.startsWith(productPath)
    );
  }

  setDependency({ productId, importeeFilePath }) {
    this.products[productId].crossProductDependencies.add(importeeFilePath);
  }
}

module.exports = CrossProductDependencies;
