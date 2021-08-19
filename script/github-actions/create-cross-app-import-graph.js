// const fs = require('fs');
// const path = require('path');
// const findImports = require('find-imports');

const diff = process.env.DIFF_RESULTS;
// eslint-disable-next-line no-console
console.log('Diff: ', diff);

// const files = ['src/applications/**/*.*'];
// const imports = findImports(files, {
//   absoluteImports: true,
//   relativeImports: true,
//   packageImports: false,
// });
// const graph = {};

// function getAppName(file) {
//   return file.split('/')[2];
// }

// function dedupeGraph() {
//   Object.keys(graph).forEach(app => {
//     graph[app] = [...new Set(graph[app])];
//   });
// }

// function writeGraph() {
//   try {
//     fs.writeFileSync(
//       path.resolve(__dirname, '../../config/cross_app_import_graph.json'),
//       JSON.stringify(graph, null, 2),
//     );
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.error(err);
//   }
// }

// function buildGraph() {
//   Object.keys(imports).forEach(file => {
//     const appName = getAppName(file);
//     const filePathAsArray = file.split('/');

//     if (!graph[appName]) graph[appName] = [appName];

//     imports[file].forEach(importRelPath => {
//       if (importRelPath.startsWith('../')) {
//         const numDirsUp = importRelPath.split('/').filter(str => str === '..')
//           .length;
//         const importPath = importRelPath.replace(
//           '../'.repeat(numDirsUp),
//           `${filePathAsArray
//             .slice(0, filePathAsArray.length - 1 - numDirsUp)
//             .join('/')}/`,
//         );

//         if (
//           importPath.startsWith('src/applications') &&
//           !importPath.startsWith(`src/applications/${appName}`)
//         ) {
//           const importAppName = getAppName(importPath);

//           if (!graph[importAppName]) graph[importAppName] = [importAppName];

//           graph[appName].push(importAppName);
//           graph[importAppName].push(appName);
//         }
//       }
//     });
//   });
// }

// buildGraph();
// dedupeGraph();
// writeGraph();
