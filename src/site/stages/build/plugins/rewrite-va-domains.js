/* eslint-disable no-param-reassign, no-continue */

function createRedirects(options) {
  return (files, metalsmith, done) => {
    if (options.domainReplacements) {
      Object.keys(files)
        .filter(fileName => fileName.endsWith('html'))
        .forEach(fileName => {
          const file = files[fileName];
          let contents = file.contents.toString();
          options.domainReplacements.forEach(domain => {
            const regex = new RegExp(domain.from, 'g');
            contents = contents.replace(regex, domain.to);
          });

          file.contents = new Buffer(contents);
        });
    }

    done();
  };
}

module.exports = createRedirects;
