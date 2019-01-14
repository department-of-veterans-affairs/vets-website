const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const { applyFragments } = require('./apply-fragments');

const MEGAMENU_DATA_SOURCE_FILENAME = 'megamenu/index.yml';
const MEGAMENU_CACHE_FILENAME = 'megamenu.json';

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
    done();
  };
}

module.exports = createMegaMenuData;
