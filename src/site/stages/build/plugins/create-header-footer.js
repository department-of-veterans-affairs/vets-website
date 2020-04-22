const footerData = require('../../../../platform/static-data/footer-links.json');
const DRUPALS = require('../../../constants/drupals');

const {
  formatHeaderData: convertDrupalHeaderData,
} = require('../drupal/menus');

function replaceWithDrupalLinks(data, files) {
  let current = data;
  if (Array.isArray(data)) {
    // This means we're always creating a shallow copy of arrays, but
    // that seems worth the complexity trade-off
    current = data.map(item => replaceWithDrupalLinks(item, files));
  } else if (!!current && typeof current === 'object') {
    Object.keys(current).forEach(key => {
      let newValue = current;

      if (
        key === 'href' &&
        files[
          `drupal${current[key]
            .replace('https://www.va.gov', '')
            .replace(/\/$/, '')}/index.html`
        ]
      ) {
        newValue = current[key].replace('www.va.gov/', 'www.va.gov/drupal/');
      } else {
        newValue = replaceWithDrupalLinks(current[key], files);
      }

      if (newValue !== current[key]) {
        current = Object.assign({}, current, {
          [key]: newValue,
        });
      }
    });
  }

  return current;
}

function createHeaderFooterData(buildOptions) {
  return (files, metalsmith, done) => {
    const megaMenuData = convertDrupalHeaderData(
      buildOptions,
      buildOptions.drupalData,
    );

    const headerFooter = {
      footerData,
      megaMenuData,
    };

    const serialized = JSON.stringify(headerFooter, null, 4);

    const drupalMenu = DRUPALS.PREFIXED_ENVIRONMENTS.has(buildOptions.buildtype)
      ? replaceWithDrupalLinks(headerFooter, files)
      : headerFooter;
    const drupalMenuSerialized = JSON.stringify(drupalMenu, null, 4);

    Object.keys(files).forEach(file => {
      if (files[file].isDrupalPage) {
        // eslint-disable-next-line no-param-reassign
        files[file].headerFooterData = drupalMenuSerialized;
      } else {
        // eslint-disable-next-line no-param-reassign
        files[file].headerFooterData = serialized;
      }
    });

    // eslint-disable-next-line no-param-reassign
    files['generated/headerFooter.json'] = {
      contents: new Buffer(serialized),
    };

    // eslint-disable-next-line no-param-reassign
    files['generated/drupalHeaderFooter.json'] = {
      contents: new Buffer(drupalMenuSerialized),
    };

    done();
  };
}

module.exports = createHeaderFooterData;
