/* eslint-disable no-console */

const defaultCollections = require('../script/collections/default.json');
const brandConsolidationCollections = require('../script/collections/brand-consolidation.json');

const checkCollections = buildOptions => (files, metalsmith, done) => {
  const collection = buildOptions['brand-consolidation-enabled']
    ? Object.keys(brandConsolidationCollections)
    : Object.keys(defaultCollections);

  const brokenCollections = Object.keys(files).reduce((accum, key) => {
    const file = files[key];

    if (key.includes('.html')) {
      if (file.collection.length > 0) {
        file.collection.forEach(collectionName => {
          if (!collection.includes(collectionName)) {
            accum.push(
              `Error: Your [ collection "${collectionName}" ] does not exist in the collection: ${key}`,
            );
          }
        });
      }

      if (file.children && !collection.includes(file.children)) {
        accum.push(
          `Error: Your [ children: "${
            file.children
          }" ] does not exist in the collection: ${key}`,
        );
      }
    }

    return accum;
  }, []);

  if (brokenCollections.length > 0) {
    console.warn(
      '\n \nBroken Collection Error: Your collections or children in your front-matter file ',
    );
    brokenCollections.forEach(error => {
      console.warn(error);
    });

    done(new Error(`You have ${brokenCollections.length} broken collections`));
  }

  done();
};

module.exports = checkCollections;
