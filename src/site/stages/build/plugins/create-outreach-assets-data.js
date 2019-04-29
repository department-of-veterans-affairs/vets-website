/* eslint-disable no-param-reassign */

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

    const fieldMedias = outreachAssets.entities.map(e => e.fieldMedia.entity);
    const documentFieldMedias = fieldMedias.filter(
      f => f.entityBundle === ENTITY_BUNDLES.DOCUMENT,
    );
    const imageFieldMedias = fieldMedias.filter(
      f => f.entityBundle === ENTITY_BUNDLES.IMAGE,
    );

    documentFieldMedias.forEach(docFieldMedia => {
      const relativeUrl = docFieldMedia.fieldDocument.entity.url;
      const noSlash = relativeUrl.slice(1);

      docFieldMedia.fieldDocument.entity.absoluteUrl = `${hostUrl}${relativeUrl}`;
      docFieldMedia.fieldDocument.entity.size =
        files[noSlash].contents.byteLength;
    });

    imageFieldMedias.forEach(imageFieldMedia => {
      const relativeUrl = imageFieldMedia.image.url;
      const noSlash = relativeUrl.slice(1);

      imageFieldMedia.image.absoluteUrl = `${hostUrl}${relativeUrl}`;
      imageFieldMedia.image.size = files[noSlash].contents.byteLength;
    });

    const outreachAssetsFileName = 'generated/outreach-assets.json';
    const serializedOutreachAssets = JSON.stringify(outreachAssets, null, 2);

    files[outreachAssetsFileName] = {
      contents: Buffer.from(serializedOutreachAssets),
    };

    done();
  };
}

module.exports = createOutreachAssetsData;
