const path = require('path');
const childProcess = require('child_process');

function checkAccessibility(buildOptions) {

  // if (buildOptions.watch) {
  //   // Too costly
  // }

  return async (files, metalsmith, done) => {

    console.log('Starting accessibility tests...');
    console.time('508');

    const htmlFiles = Object
      .keys(files)
      .filter(fileName => path.extname(fileName) === '.html')
      .slice(0, 100)
      .map(fileName => files[fileName]);


    const processes = htmlFiles.map(async file => {

      return new Promise((resolve) => {
        const child = childProcess.fork(__dirname + '/check-accessibility-helpers');

        child.on('message', result => {
          resolve(result);
          child.kill();
        });

        child.send(file.contents.toString());
      });
    });

    try {
      const results = await Promise.all(processes);
      console.log(results)
      console.timeEnd('508');
      done();
    } catch (err) {
      done(err);
    }
  };
}

module.exports = checkAccessibility;
