/* eslint-disable class-methods-use-this */
const findImports = require('find-imports');
// const fs = require('fs');

class CrossProductDependencies {
  constructor({ products }) {
    this.products = products;
    this.paths = '';
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

    // this.paths += `productPath: ${productPath}\n`;
    // this.paths += `importedFilePath: ${importedFilePath}\n`;
    // this.paths += `parentDirectory: ${parentDirectory}\n`;
    // this.paths += '\n';

    return !(
      importedFilePath.startsWith(parentDirectory) ||
      importedFilePath.startsWith(productPath)
    );
  }

  setDependency({ productId, importedFilePath }) {
    this.products[productId].crossProductDependencies.add(importedFilePath);
  }

  // writePathsToFile() {
  //   // delete the following before submitting pr
  //   // eslint-disable-next-line func-names
  //   fs.writeFileSync(
  //     'paths.txt',
  //     this.paths,
  //     // eslint-disable-next-line func-names
  //     function(err) {
  //       if (err) {
  //         // eslint-disable-next-line no-console
  //         console.log(err);
  //       }
  //     },
  //   );
  // }
}

module.exports = CrossProductDependencies;
