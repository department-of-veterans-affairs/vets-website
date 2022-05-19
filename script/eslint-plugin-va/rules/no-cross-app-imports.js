const path = require('path');
const MESSAGE = 'No cross app imports allowed';
module.exports = {
  meta: {
    docs: {
      description: MESSAGE,
      category: 'problem',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const currentPath = context.getFilename();

        let importPath;
        // import not a relative import
        if (value.startsWith('applications')) {
          importPath = path.join('vets-website', 'src', value);
          // relative import
        } else if (value.startsWith('..')) {
          const currentDir = path.join(currentPath, '..');
          importPath = path.join(currentDir, value);
          // not a vets-website import or not a cross app import
        } else {
          importPath = value;
        }

        const testLocation = new RegExp('vets-website/src/applications');
        // are the current file and the import in vets-website apps?
        if (importPath.match(testLocation) && currentPath.match(testLocation)) {
          const regex = new RegExp('applications/(?<app>[a-zA-Z0-9_-]+)/');
          const importedApp = importPath.match(regex)?.groups?.app;
          const currentApp = currentPath.match(regex)?.groups?.app;

          if (importedApp !== currentApp) {
            context.report({
              node,
              message: `${MESSAGE}: ${currentApp} importing from ${importedApp}`,
            });
          }
        }
      },
    };
  },
};
