import React from 'react';

// Dynamic require for all images in emblems folder
function importAll(r) {
  const map = {};
  r.keys().forEach(k => {
    map[k.replace('./', '')] = r(k);
  });
  return map;
}

// Webpack context (adjust if build complains)
const images = importAll(
  require.context('../images/emblems', false, /\.(png|jpe?g|gif|svg)$/),
);

let manifest = [];
try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  manifest = require('../images/emblems/emblemManifest.json');
} catch (e) {
  // Manifest not present yet
}

export default function EmblemGallery() {
  if (!manifest.length) {
    return <p>No emblems downloaded yet.</p>;
  }
  return (
    <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
      {manifest.map(item => {
        const src = images[item.file];
        if (!src) return null;
        return (
          <figure
            key={item.file}
            className="vads-u-width--auto vads-u-margin--0 vads-u-padding--1 vads-u-margin-right--2 vads-u-margin-bottom--2"
          >
            <img
              src={src}
              alt={item.alt}
              width="80"
              height="80"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="vads-u-font-size--sm">{item.alt}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
