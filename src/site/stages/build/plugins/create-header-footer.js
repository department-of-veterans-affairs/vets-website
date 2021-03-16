const jsesc = require('jsesc');

const footerData = require('../../../../platform/static-data/footer-links.json');

const {
  formatHeaderData: convertDrupalHeaderData,
} = require('../drupal/menus');

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

    const stringified = JSON.stringify(headerFooter);

    metalsmith.metadata({
      headerFooterData: jsesc(stringified, {
        json: true,
        isScriptContext: true,
      }),
      ...metalsmith.metadata(),
    });

    // eslint-disable-next-line no-param-reassign
    files['generated/headerFooter.json'] = {
      contents: Buffer.from(stringified),
    };

    done();
  };
}

module.exports = createHeaderFooterData;
