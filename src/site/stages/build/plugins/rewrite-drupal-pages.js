/* eslint-disable no-param-reassign, no-continue */
const DRUPALS = require('../../../constants/drupals');

function rewriteDrupalPages(options) {
  if (
    !DRUPALS.ENABLED_ENVIRONMENTS.has(options.buildtype) ||
    !DRUPALS.PREFIXED_ENVIRONMENTS.has(options.buildtype)
  ) {
    return () => {};
  }

  return (files, metalsmith, done) => {
    const replacements = Object.keys(files)
      .filter(fileName => files[`drupal/${fileName}`])
      .map(fileName => ({
        from: `"/${fileName.replace('/index.html', '')}"`,
        to: `"/drupal/${fileName.replace('index.html', '')}"`,
      }));

    replacements.push({
      from: '"/"',
      to: '"/drupal/"',
    });

    Object.keys(files)
      .filter(
        fileName => fileName.endsWith('html') && files[fileName].isDrupalPage,
      )
      .forEach(fileName => {
        const file = files[fileName];
        let contents = file.contents.toString();
        replacements.forEach(domain => {
          const regex = new RegExp(domain.from, 'g');
          contents = contents.replace(regex, domain.to);
        });

        file.contents = new Buffer(contents);
      });

    done();
  };
}

module.exports = rewriteDrupalPages;
