/* eslint-disable no-param-reassign, no-continue */
const {
  createEntityUrlObj,
  createFileObj,
  paginatePages,
  updateEntityUrlObj,
  generateBreadCrumbs,
} = require('./page');


function addHomeContent(contentData, files, drupalPagePath) {
  files[`${drupalPagePath}/index.html`] = createFileObj(
    createEntityUrlObj({}, 'Home'),
    'home.drupal.liquid',
  );
}

module.exports = { addHomeContent };
