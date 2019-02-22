const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const { applyFragments } = require('./apply-fragments');

const MEGAMENU_DATA_SOURCE_FILENAME = 'megamenu/index.yml';
const MEGAMENU_CACHE_FILENAME = 'megamenu.json';

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
          `drupal${current[key].replace('https://www.va.gov', '')}/index.html`
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
function writeToCache(buildOptions, megaMenuData) {
  const megamenuDataCacheFileName = path.join(
    buildOptions.cacheDirectory,
    MEGAMENU_CACHE_FILENAME,
  );
  const serialized = JSON.stringify(megaMenuData, null, 4);

  fs.ensureDirSync(buildOptions.cacheDirectory);
  fs.writeFileSync(megamenuDataCacheFileName, serialized);
}

function createMegaMenuData(buildOptions) {
  return (files, metalsmith, done) => {
    const fragmentsRoot = metalsmith.path(buildOptions.contentFragments);
    const megaMenuDataSourceFile = path.join(
      fragmentsRoot,
      MEGAMENU_DATA_SOURCE_FILENAME,
    );
    const megaMenuFile = fs.readFileSync(megaMenuDataSourceFile);
    const megaMenuData = yaml.safeLoad(megaMenuFile);

    const [vaBenefitsAndHealthCare, aboutVa] = megaMenuData;

    // "promotions", which is data that (as of writing) are located under the "columnThree"
    // property, has to exist in a separate file for editing/organizational reasons.
    // To accomplish this, we borrow use the fragments concept. More info in that middleware.
    for (const hub of vaBenefitsAndHealthCare.menuSections) {
      applyFragments(buildOptions, metalsmith, hub.links);
      delete hub.links.fragments;
    }

    applyFragments(buildOptions, metalsmith, aboutVa.menuSections);
    delete aboutVa.menuSections.fragments;

    writeToCache(buildOptions, megaMenuData);

    const serialized = JSON.stringify(megaMenuData, null, 4);

    const drupalMenu = replaceWithDrupalLinks(megaMenuData, files);
    const drupalMenuSerialized = JSON.stringify(drupalMenu, null, 4);

    Object.keys(files).forEach(file => {
      if (files[file].isDrupalPage) {
        // eslint-disable-next-line no-param-reassign
        files[file].megaMenuData = drupalMenuSerialized;
      } else {
        // eslint-disable-next-line no-param-reassign
        files[file].megaMenuData = serialized;
      }
    });

    done();
  };
}

module.exports = createMegaMenuData;
