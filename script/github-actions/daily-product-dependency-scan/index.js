const findImports = require('find-imports');
const fs = require('fs');
const glob = require('glob');

const manifestPaths = glob.sync('src/applications/**/*manifest.json');
const productMeta = {};

manifestPaths.forEach(path => {
  const manifest = JSON.parse(fs.readFileSync(path));
  const { productId } = manifest;

  if (productId) {
    const productPath = path.slice(0, path.lastIndexOf('/'));

    productMeta[productPath] = {
      productId,
      productPath,
      packageDependencies: new Set(),
      productsThatThisProductImportsFrom: new Set(),
      productsThatImportFromThisProduct: new Set(),
    };
  }
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

function getImportPath(importerFilePath, importRef) {
  const filePathAsArray = importerFilePath.split('/');

  if (importRef.startsWith('applications/')) {
    return `src/${importRef}`;
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
  let path = null;
  let noPathMatch = true;

  while (noPathMatch) {
    const productPath = importeeFilePath.slice(
      0,
      importeeFilePath.lastIndexOf('/'),
    );

    if (productMeta[productPath]) {
      path = productPath;
      noPathMatch = false;
    }
  }

  return path;
}

function updateGraph(productPath, importerFilePath, importeeFilePath) {
  const importProductPath = getProductPathFromFilePath(importeeFilePath);

  if (!productMeta[productPath].appsThatThisAppImportsFrom[importProductPath]) {
    productMeta[productPath].appsThatThisAppImportsFrom[importProductPath] = {
      filesImported: [],
    };
  }

  productMeta[productPath].appsThatThisAppImportsFrom[
    importProductPath
  ].filesImported.add({
    importer: importerFilePath,
    importee: importeeFilePath,
  });

  if (!productMeta[importProductPath].appsThatImportFromThisApp[productPath]) {
    productMeta[importProductPath].appsThatImportFromThisApp[productPath] = {
      filesImported: [],
    };
  }

  productMeta[importProductPath].appsThatImportFromThisApp[
    productPath
  ].filesImported.add({
    importer: importerFilePath,
    importee: importeeFilePath,
  });

  // console.log('importer', productMeta[productPath]);
  // console.log('importee', productMeta[importProductPath]);
}

function crossProductDependencyGraph({ productPaths }) {
  productPaths.forEach(productPath => {
    const imports = findImports(`${productPath}/**/*.{js,jsx}`, {
      absoluteImports: true,
      relativeImports: true,
      packageImports: false,
    });

    Object.keys(imports).forEach(importerFilePath => {
      imports[importerFilePath].forEach(importRef => {
        const importeeFilePath = getImportPath(importerFilePath, importRef);

        if (importIsFromOtherProduct(productPath, importeeFilePath)) {
          updateGraph(productPath, importerFilePath, importeeFilePath);
        }
      });
    });
  });
}

crossProductDependencyGraph({ productPaths: Object.keys(productMeta) });
