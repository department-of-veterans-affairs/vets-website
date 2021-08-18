const fs = require('fs');
const path = require('path');
const findImports = require('find-imports');

const files = ['src/applications/**/*.*'];
const imports = findImports(files, {
  absoluteImports: true,
  relativeImports: true,
  packageImports: false,
});

try {
  fs.writeFileSync(
    path.resolve(__dirname, '../../config/cross_app_import_graph.json'),
    JSON.stringify(imports),
  );
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
}
