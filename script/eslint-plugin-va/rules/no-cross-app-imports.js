const path = require('path');
const message = 'No cross app imports allowed.';
module.exports = {
  meta: {
    docs: {
      description: message,
      category: 'problem',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const pathToImport = path.resolve(value);
        // is the import from vets-website?
        if (pathToImport.includes('src/applications')) {
          const regex = new RegExp('applications/(?<app>[a-zA-Z0-9_-]+)/');
          const importedApp = pathToImport.match(regex).matches?.app;
          const currentPath = context.getCwd();
          const currentApp = currentPath.match(regex).matches?.app;
          // is the import a cross app import?
          if (importedApp !== currentApp) {
            context.report({
              node,
              message,
            });
          }
        }
      },
    };
  },
};
