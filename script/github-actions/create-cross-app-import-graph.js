// const fs = require('fs');
// const path = require('path');
// const findImports = require('find-imports');
const core = require('@actions/core');

const diff = process.env.DIFF_RESULTS;
// eslint-disable-next-line no-console
console.log('Diff: ', diff);

function findChange() {
  const srcApplicationChanges = [];
  const startOfChange = 'diff --git a/src/applications';
  const endOfChange = 'diff --git a/';
  let start = null;

  for (let i = 0; i <= diff.length; i += 1) {
    if (
      !start &&
      diff[i] === 'd' &&
      diff.slice(i, i + startOfChange.length) === startOfChange
    ) {
      start = i;
    } else if (
      start &&
      diff[i] === 'd' &&
      diff.slice(i, i + endOfChange.length) === endOfChange
    ) {
      // eslint-disable-next-line no-console
      console.log('I AM IN THE SECOND CONDITION');
      srcApplicationChanges.push(diff.slice(start, i));
      start = null;
    } else if (start && i === diff.length - 1) {
      srcApplicationChanges.push(diff.slice(start));
    }

    if (diff[i] === 'd') {
      // eslint-disable-next-line no-console
      console.log('i: ', i);
      // eslint-disable-next-line no-console
      console.log(
        'startOfChange slice: ',
        diff.slice(i, i + startOfChange.length),
      );
      // eslint-disable-next-line no-console
      console.log('endOfChange slice: ', diff.slice(i, i + endOfChange.length));
    }
  }

  // eslint-disable-next-line no-console
  console.log('Application changes:');
  srcApplicationChanges.forEach((change, i) => {
    // eslint-disable-next-line no-console
    console.log(`Change ${i}:`);
    // eslint-disable-next-line no-console
    console.log(change);
  });
}

// diff example where last change is line break
// rule: scan for + with following by character/no space
// +// eslint-disable-next-line no-console +console.log('For testing'); +

if (diff.includes('+++ b/src/applications')) {
  findChange();
} else {
  core.exportVariable('IS_GRAPH_UPDATED', false);
}

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
