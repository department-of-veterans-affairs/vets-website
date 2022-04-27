/* eslint-disable class-methods-use-this */
const findImports = require('find-imports');

class CrossProductDependencies {
  constructor({ products }) {
    this.products = products;
  }

  setDependencies() {
    Object.keys(this.products).forEach(productPath => {
      const imports = findImports(`${productPath}/**/*.*`, {
        absoluteImports: true,
        relativeImports: true,
        packageImports: false,
      });

      Object.keys(imports).forEach(importerFilePath => {
        imports[importerFilePath].forEach(importRef => {
          const importeeFilePath = this.getImportPath(
            importerFilePath,
            importRef,
          );

          if (
            importeeFilePath.startsWith('src/platform') ||
            importeeFilePath.startsWith('src/site')
          )
            return;

          const importProductPath = this.getProductPathFromFilePath(
            importeeFilePath,
          );

          if (
            importProductPath &&
            this.importIsFromOtherProduct(productPath, importeeFilePath)
          ) {
            this.updateGraph(
              productPath,
              importProductPath,
              importerFilePath,
              importeeFilePath,
            );
          }
        });
      });
    });
  }

  getImportPath(importerFilePath, importRef) {
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

  importIsFromOtherProduct(productPath, importPath) {
    return !importPath.startsWith(productPath);
  }

  getProductPathFromFilePath(importeeFilePath) {
    let path = importeeFilePath;
    let noPathMatch = true;

    while (path.includes('/') && noPathMatch) {
      path = path.slice(0, path.lastIndexOf('/'));

      if (this.products[path]) {
        noPathMatch = false;
      }
    }

    return noPathMatch ? null : path;
  }

  updateGraph(
    productPath,
    importProductPath,
    importerFilePath,
    importeeFilePath,
  ) {
    if (
      !this.products[productPath].productsThatThisProductImportsFrom[
        importProductPath
      ]
    ) {
      this.products[productPath].productsThatThisProductImportsFrom[
        importProductPath
      ] = {
        filesImported: new Set(),
      };
    }

    this.products[productPath].productsThatThisProductImportsFrom[
      importProductPath
    ].filesImported.add({
      importer: importerFilePath,
      importee: importeeFilePath,
    });

    if (
      !this.products[importProductPath].productsThatImportFromThisProduct[
        productPath
      ]
    ) {
      this.products[importProductPath].productsThatImportFromThisProduct[
        productPath
      ] = {
        filesImported: new Set(),
      };
    }

    this.products[importProductPath].productsThatImportFromThisProduct[
      productPath
    ].filesImported.add({
      importer: importerFilePath,
      importee: importeeFilePath,
    });
  }
}

module.exports = CrossProductDependencies;
