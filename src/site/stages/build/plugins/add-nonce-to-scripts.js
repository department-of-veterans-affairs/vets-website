/* eslint-disable no-param-reassign */
const path = require('path');

const CSP_NONCE = '**CSP_NONCE**';

function generateNewId(existingIds) {
  const newId = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 10);
  if (!existingIds.has(newId)) {
    existingIds.add(newId);
    return newId;
  }
  return generateNewId(existingIds);
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
    const ids = new Set();
    const clickHandlers = [];
    dom('[onclick]').each((index, onClickEl) => {
      const o = dom(onClickEl);
      if (!o.attr('id')) {
        o.attr('id', generateNewId(ids)); // eslint-disable-line no-param-reassign
      }
      const id = o.attr('id');
      const onclick = o.attr('onclick');

      clickHandlers.push(
        `document.getElementById('${id}').addEventListener('click', function(ev) { ${onclick} });`,
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
