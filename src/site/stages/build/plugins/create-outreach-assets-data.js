/* eslint-disable no-param-reassign, no-continue */

const ENTITY_BUNDLES = {
  DOCUMENT: 'document',
  IMAGE: 'image',
};

function createOutreachAssetsData(buildSettings) {
  const { hostUrl } = buildSettings;

  return (files, metalsmith, done) => {
    const { drupalData } = metalsmith.metadata();

    if (!drupalData) {
      done();
      return;
    }

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
      const absoluteUrl = `${hostUrl}${relativeUrl}`;
      const fileSize = files[noSlash].contents.byteLength;

      entity.derivedFields = { absoluteUrl, fileSize };
    }

    const outreachAssetsFileName = 'generated/outreach-assets.json';
    const serializedOutreachAssets = JSON.stringify(outreachAssets, null, 2);

    files[outreachAssetsFileName] = {
      contents: Buffer.from(serializedOutreachAssets),
    };

    done();
  };
}

module.exports = createOutreachAssetsData;
