/* eslint-disable no-param-reassign, no-continue */

function rewriteAWSUrls(options) {
  return (files, metalsmith, done) => {
    Object.keys(files)
      .filter(
        fileName => fileName.endsWith('html') && files[fileName].isDrupalPage,
      )
      .forEach(fileName => {
        const file = files[fileName];
        let contents = file.contents.toString();
        const regex = new RegExp(options['drupal-address'], 'g');
        contents = contents.replace(regex, file.drupalSite);

        file.contents = new Buffer(contents);
      });
    done();
  };
}

module.exports = rewriteAWSUrls;
