/* eslint-disable no-param-reassign, no-continue */

function convertMarkdownToJavaScript() {
  return (files, metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      const fileData = files[fileName];
      const {
        is_js: isJs
      } = fileData;

      if (!isJs) continue;

      const jsFile = fileName.replace('/index.html', '');

      files[jsFile] = {
        ...fileData,
        path: jsFile
      };

      delete files[fileName];
    }
    done();
  };
}

module.exports = convertMarkdownToJavaScript;
