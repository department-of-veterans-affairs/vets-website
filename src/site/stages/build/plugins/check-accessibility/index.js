const path = require('path');

const executeAxeCheck = require('./helpers/executeAxeCheck');
const ignoreSpecialPages = require('./helpers/ignoreSpecialPages');
const getErrorOutput = require('./helpers/getErrorOutput');


function getHtmlFileList(files) {
  return Object.keys(files)
    .filter(fileName => path.extname(fileName) === '.html')
    .map(fileName => files[fileName])
    .slice(0, 270)
    .concat([files['index.html']]);
}

function checkAccessibility(buildOptions) {
  return async (files, metalsmith, done) => {
    console.log('Starting accessibility tests...');
    console.time('Accessibility');

    const htmlFiles = getHtmlFileList(files);

    // const processes = htmlFiles.map(async (file, index) => {
    //   const props = {
    //     url: file.path,
    //     html: file.contents.toString(),
    //   };

    //   const delay = index * 1000;

    //   await new Promise((resolve) => setTimeout(resolve, delay));

    //   console.log(`enqueuing ${props.url}`);
    //   const result = await executeAxeCheck(props);

    //   result.url = props.url;

    //   if (result.violations.length > 0) {
    //     console.log(getErrorOutput(result));
    //   } else {
    //     console.log(`${result.url}: ✓`);
    //   }

    //   return result;
    // });

    for (const file of htmlFiles) {
      const props = {
        url: file.path,
        html: file.contents.toString(),
      };

      const result = await executeAxeCheck(props);

      result.url = props.url;

      if (result.violations.length > 0) {
        console.log(getErrorOutput(result));
      } else {
        console.log(`${result.url}: ✓`);
      }
    }

    // const results = await Promise.all(processes);
    // const output = results.map(getErrorOutput).join('\n');

    // console.log(output);
    console.timeEnd('Accessibility');
    done();
  };
}

module.exports = checkAccessibility;
