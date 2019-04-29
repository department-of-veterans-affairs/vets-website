/* eslint-disable no-param-reassign */

function createOutreachAssetsData() {
  return (files, metalsmith, done) => {
    const {
      drupalData: {
        data: { outreachAssets },
      },
    } = metalsmith.metadata();

    const outreachAssetsFileName = 'generated/outreach-assets.json';
    const serializedOutreachAssets = JSON.stringify(outreachAssets, null, 2);

    files[outreachAssetsFileName] = {
      contents: Buffer.from(serializedOutreachAssets),
    };

    done();
  };
}

module.exports = createOutreachAssetsData;
