/* eslint-disable no-param-reassign, no-continue */

const ENVIRONMENTS = require('../../../constants/environments');
const BUCKETS = require('../../../constants/buckets');

const ENTITY_BUNDLES = {
  DOCUMENT: 'document',
  IMAGE: 'image',
};

function createOutreachAssetsData(buildSettings) {
  const bucket =
    buildSettings.buildtype === ENVIRONMENTS.LOCALHOST
      ? buildSettings.hostUrl
      : BUCKETS[buildSettings.buildtype];

  return (files, metalsmith, done) => {
    const { drupalData } = buildSettings;

    if (!drupalData) {
      done();
      return;
    }

    const {
      data: { outreachAssets },
    } = drupalData;

    for (const entity of outreachAssets.entities) {
      let relativeUrl = '';
      if (entity.entityBundle) {
        switch (entity.fieldMedia.entity.entityBundle) {
          case ENTITY_BUNDLES.DOCUMENT:
            relativeUrl = entity.fieldMedia.entity.fieldDocument.entity.url;
            break;
          case ENTITY_BUNDLES.IMAGE:
            relativeUrl = entity.fieldMedia.entity.image.url;
            break;
          default:
            break;
        }
      }
      if (!relativeUrl) continue;

      const noSlash = relativeUrl.slice(1);
      const absoluteUrl = `${bucket}${relativeUrl}`;
      const fileSize = files[noSlash].contents.byteLength;

      entity.derivedFields = { absoluteUrl, fileSize };
    }

    metalsmith.metadata({
      outreachAssetsDataArray: outreachAssets,
      ...metalsmith.metadata(),
    });

    done();
  };
}

module.exports = createOutreachAssetsData;
