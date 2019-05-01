/* eslint-disable no-param-reassign, no-continue */

const { logDrupal } = require('../drupal/utilities-drupal');
const ENVIRONMENTS = require('../../../constants/environments');
const BUCKETS = require('../../../constants/buckets');

const ENTITY_BUNDLES = {
  DOCUMENT: 'document',
  IMAGE: 'image',
};

function createOutreachAssetsJson(buildSettings, files, metalsmith) {
  const bucket =
    buildSettings.buildtype === ENVIRONMENTS.LOCALHOST
      ? buildSettings.hostUrl
      : BUCKETS[buildSettings.buildtype];

  const { drupalData } = metalsmith.metadata();

  const {
    data: { outreachAssets },
  } = drupalData;

  for (const entity of outreachAssets.entities) {
    let relativeUrl = '';

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

    if (!relativeUrl) continue;

    const noSlash = relativeUrl.slice(1);
    const absoluteUrl = `${bucket}${relativeUrl}`;
    const fileSize = files[noSlash].contents.byteLength;

    entity.derivedFields = { absoluteUrl, fileSize };
  }

  const outreachAssetsFileName = 'generated/outreach-assets.json';
  const serializedOutreachAssets = JSON.stringify(outreachAssets, null, 2);

  files[outreachAssetsFileName] = {
    contents: Buffer.from(serializedOutreachAssets),
  };
}

function createOutreachAssetsData(buildSettings) {
  return (files, metalsmith, done) => {
    try {
      createOutreachAssetsJson(buildSettings, files, metalsmith);
    } catch (err) {
      logDrupal('Failed to generate outreach-assets.json!');
      if (buildSettings.buildtype === ENVIRONMENTS.VAGOVPROD) {
        done(err);
      } else {
        done();
      }
    }
  };
}

module.exports = createOutreachAssetsData;
