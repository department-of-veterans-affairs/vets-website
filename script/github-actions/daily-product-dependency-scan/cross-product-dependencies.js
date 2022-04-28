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

          const importProductPath = this.getImportProductPathFromFilePath({
            importeeFilePath,
          });

          if (
            importProductPath &&
            this.importIsFromOtherProduct({ productPath, importeeFilePath })
          ) {
            this.setDependency({
              productId,
              importProductPath,
              importerFilePath,
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
    return !importeeFilePath.startsWith(productPath);
  }

  getImportProductPathFromFilePath({ importeeFilePath }) {
    let path = importeeFilePath;
    let noPathMatch = true;

    while (path.includes('/') && noPathMatch) {
      path = path.slice(0, path.lastIndexOf('/'));
      const productIds = Object.keys(this.products);

      for (let i = 0; i < productIds.length; i += 1) {
        if (this.products[productIds[i]].productPath === path) {
          noPathMatch = false;
          break;
        }
      }
    }

    return noPathMatch ? null : path;
  }

  setDependency({
    productId,
    importProductPath,
    importerFilePath,
    importeeFilePath,
  }) {
    if (!this.products[productId].crossProductDependencies[importProductPath]) {
      this.products[productId].crossProductDependencies[importProductPath] = {
        filesImported: new Set(),
      };
    }

    this.products[productId].crossProductDependencies[
      importProductPath
    ].filesImported.add({
      importer: importerFilePath,
      importee: importeeFilePath,
    });
  }
}

module.exports = CrossProductDependencies;
