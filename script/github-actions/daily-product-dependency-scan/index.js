const findImports = require('find-imports');
const fs = require('fs');
const glob = require('glob');

const manifestPaths = glob.sync('src/applications/**/*manifest.json');
const productMeta = {};

function getImportPath(importerFilePath, importRef) {
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

function importIsFromOtherProduct(productPath, importPath) {
  return !importPath.startsWith(productPath);
}

function getProductPathFromFilePath(importeeFilePath) {
  let path = importeeFilePath;
  let noPathMatch = true;

  while (path.includes('/') && noPathMatch) {
    path = path.slice(0, path.lastIndexOf('/'));

    if (productMeta[path]) {
      noPathMatch = false;
    }
  }

  return noPathMatch ? null : path;
}

function updateGraph(
  productPath,
  importProductPath,
  importerFilePath,
  importeeFilePath,
) {
  if (
    !productMeta[productPath].productsThatThisProductImportsFrom[
      importProductPath
    ]
  ) {
    productMeta[productPath].productsThatThisProductImportsFrom[
      importProductPath
    ] = {
      filesImported: new Set(),
    };
  }

  productMeta[productPath].productsThatThisProductImportsFrom[
    importProductPath
  ].filesImported.add({
    importer: importerFilePath,
    importee: importeeFilePath,
  });

  if (
    !productMeta[importProductPath].productsThatImportFromThisProduct[
      productPath
    ]
  ) {
    productMeta[importProductPath].productsThatImportFromThisProduct[
      productPath
    ] = {
      filesImported: new Set(),
    };
  }

  productMeta[importProductPath].productsThatImportFromThisProduct[
    productPath
  ].filesImported.add({
    importer: importerFilePath,
    importee: importeeFilePath,
  });
}

function crossProductDependencyGraph({ productPaths }) {
  productPaths.forEach(productPath => {
    const imports = findImports(`${productPath}/**/*.*`, {
      absoluteImports: true,
      relativeImports: true,
      packageImports: false,
    });

    Object.keys(imports).forEach(importerFilePath => {
      imports[importerFilePath].forEach(importRef => {
        const importeeFilePath = getImportPath(importerFilePath, importRef);

        if (
          importeeFilePath.startsWith('src/platform') ||
          importeeFilePath.startsWith('src/site')
        )
          return;

        const importProductPath = getProductPathFromFilePath(importeeFilePath);

        if (
          importProductPath &&
          importIsFromOtherProduct(productPath, importeeFilePath)
        ) {
          updateGraph(
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

manifestPaths.forEach(path => {
  const manifest = JSON.parse(fs.readFileSync(path));
  const productId = manifest.productId || null;

  const productPath = path.slice(0, path.lastIndexOf('/'));

  productMeta[productPath] = {
    productId,
    productPath,
    packageDependencies: new Set(),
    productsThatThisProductImportsFrom: new Set(),
    productsThatImportFromThisProduct: new Set(),
  };
});

Object.values(productMeta).forEach(product => {
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

crossProductDependencyGraph({ productPaths: Object.keys(productMeta) });

// console.log(productMeta);
