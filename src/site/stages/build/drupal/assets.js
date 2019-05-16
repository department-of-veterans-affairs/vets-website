const getDrupalClient = require('./api');
const cheerio = require('cheerio');

const siteURIs = [
  'http://prod.cms.va.gov',
  'https://prod.cms.va.gov',
  'http://staging.cms.va.gov',
  'https://staging.cms.va.gov',
  'http://stg.cms.va.gov',
  'https://stg.cms.va.gov',
  'http://dev.cms.va.gov',
  'https://dev.cms.va.gov',
  'http://cms.va.gov',
  'https://cms.va.gov',
];

function replacePathInData(data, replacer) {
  let current = data;
  if (Array.isArray(data)) {
    // This means we're always creating a shallow copy of arrays, but
    // that seems worth the complexity trade-off
    current = data.map(item => replacePathInData(item, replacer));
  } else if (!!current && typeof current === 'object') {
    Object.keys(current).forEach(key => {
      let newValue = current;

      if (typeof current[key] === 'string') {
        newValue = replacer(current[key], key);
      } else {
        newValue = replacePathInData(current[key], replacer);
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

function convertAssetPath(drupalInstance, url) {
  // After this path are other folders in the image paths,
  // but it's hard to tell if we can strip them, so I'm leaving them alone
  const withoutHost = url.replace(`${drupalInstance}/sites/default/files/`, '');
  const path = withoutHost.split('?', 2)[0];

  // This is sort of naive, but we'd like to have images in the img folder
  if (
    ['png', 'jpg', 'jpeg', 'gif', 'svg'].some(ext =>
      path.toLowerCase().endsWith(ext),
    )
  ) {
    return `/img/${path}`;
  }

  return `/files/${path}`;
}

function updateAttrAllEnvs(attr, doc) {
  const assetsToDownload = [];
  doc(`[${attr}*="cms.va.gov/sites"]`).each((i, el) => {
    const item = doc(el);
    const srcAttr = item.attr(attr);
    const siteURI = srcAttr.match(/http[s]:\/\/(.*)\.cms\.va\.gov/)[0];
    const newAssetPath = convertAssetPath(siteURI, srcAttr);
    assetsToDownload.push({
      src: srcAttr,
      dest: newAssetPath,
    });

    item.attr(attr, newAssetPath);
  });

  return assetsToDownload;
}

function convertDrupalFilesToLocal(drupalData, files, options) {
  const client = getDrupalClient(options);

  return replacePathInData(drupalData, (data, key) => {
    if (data.startsWith(`${client.getSiteUri()}/sites/default/files`)) {
      const newPath = convertAssetPath(client.getSiteUri(), data);
      const decodedFileName = decodeURIComponent(newPath).substring(1);
      // eslint-disable-next-line no-param-reassign
      files[decodedFileName] = {
        path: decodedFileName,
        source: data,
        isDrupalAsset: true,
        contents: '',
      };

      return newPath;
    }

    if (key === 'processed') {
      const doc = cheerio.load(data);
      const assetsToDownload = [
        ...updateAttrAllEnvs('href', doc),
        ...updateAttrAllEnvs('src', doc),
      ];

      if (assetsToDownload.length) {
        assetsToDownload.forEach(({ src, dest }) => {
          const decodedFileName = decodeURIComponent(dest).substring(1);
          // eslint-disable-next-line no-param-reassign
          files[decodedFileName] = {
            path: decodedFileName,
            source: src,
            isDrupalAsset: true,
            contents: '',
          };
        });
      }

      return doc.html();
    }

    return data;
  });
}

module.exports = convertDrupalFilesToLocal;
