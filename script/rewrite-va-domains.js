/* eslint-disable no-param-reassign, no-continue */
const BUILD_TYPE = require('./constants/environments');

const prodEnvironments = new Set([BUILD_TYPE.production, BUILD_TYPE.preview]);

function createRedirects(options) {
  return (files, metalsmith, done) => {
    if (!prodEnvironments.has(options.buildtype) && options.domainReplacements) {
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
