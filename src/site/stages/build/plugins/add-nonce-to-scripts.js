/* eslint-disable no-param-reassign */
const path = require('path');
const crypto = require('crypto');

const CSP_NONCE = '**CSP_NONCE**';

function idGeneratorFactory(fileName) {
  let i = 0;
  const existingIds = new Set();

  return function idGenerator() {
    const newId = crypto
      .createHash('md5')
      .update(fileName + i)
      .digest('hex');
    i++;
    if (!existingIds.has(newId)) {
      existingIds.add(newId);
      return newId;
    }
    return idGenerator();
  };
}

module.exports = (files, metalsmith, done) => {
  Object.keys(files).forEach(fileName => {
    if (path.extname(fileName) !== '.html') return;

    const { dom } = files[fileName];
    dom('script').each((index, scriptEl) => {
      const s = dom(scriptEl);
      // Only add nonce to inline scripts
      if (!s.attr('src')) {
        s.attr('nonce', CSP_NONCE);
      }
    });
    const generateNewId = idGeneratorFactory(fileName);
    const clickHandlers = [];
    dom('[onclick]').each((index, onClickEl) => {
      const o = dom(onClickEl);
      if (!o.attr('id')) {
        o.attr('id', generateNewId());
      }
      const id = o.attr('id');
      const onclick = o.attr('onclick');

      clickHandlers.push(
        `document.getElementById('${id}').addEventListener('click', function(event) { ${onclick} });`,
      );
      o.attr('onclick', null);
    });

    const scriptTag = `
     <script>
      (function() {
        ${clickHandlers.join('\n')}
      })();
     </script>`;
    const newScript = dom(scriptTag);
    newScript.attr('nonce', CSP_NONCE);

    dom('body').append(newScript);
    files[fileName].modified = true;
  });
  done();
};
