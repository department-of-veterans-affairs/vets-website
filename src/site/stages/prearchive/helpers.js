const cheerio = require('cheerio');

function updateNotNeededCheck(assetSrc, teamsiteAssets) {
  // Making an assumption here that we don't use srcset
  // to point to both external and internal images
  return (
    !assetSrc ||
    assetSrc.startsWith('http') ||
    assetSrc.startsWith('data:') ||
    assetSrc.includes(teamsiteAssets)
  );
}

function updateAssetBucketLocation(prop, assetSrc, item, bucketPath) {
  let assetBucketLocation;
  if (prop === 'srcset') {
    const sources = assetSrc.split(',');
    assetBucketLocation = sources
      .map(src => `${bucketPath}${src.trim()}`)
      .join(', ');
  } else {
    assetBucketLocation = `${bucketPath}${assetSrc}`;
  }
  item.attr(prop, assetBucketLocation);
}

function updateSrcPaths(doc, element, bucketPath, teamsiteAssets) {
  const item = doc(element);
  const possibleSrcProps = ['src', 'href', 'data-src', 'srcset'];
  possibleSrcProps.forEach(prop => {
    const assetSrc = item.attr(prop);
    const updateNotNeeded = updateNotNeededCheck(assetSrc, teamsiteAssets);
    if (!updateNotNeeded) {
      updateAssetBucketLocation(prop, assetSrc, item, bucketPath);
    }
  });
}

function updateAssetLinkElements(
  htmlFile,
  assetLinkTags,
  teamsiteAssets,
  bucketPath,
) {
  const doc = cheerio.load(htmlFile, {
    decodeEntities: false,
    _useHtmlParser2: true,
  });
  const assetLinkElements = doc(assetLinkTags);
  assetLinkElements.each((i, element) => {
    updateSrcPaths(doc, element, bucketPath, teamsiteAssets);
  });
  return doc;
}

module.exports = updateAssetLinkElements;
