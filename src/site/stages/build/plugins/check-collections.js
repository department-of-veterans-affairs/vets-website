/* eslint-disable no-console */
const path = require('path');
const collections = require('../data/collections.json');
/**
 * This checks whether there are broken collections in a front-matter .md file.
 * It checks whether a collection or children is available in the MetalSmith collections list
 * @param {object} buildOptions
 */

const checkCollections = () => (files, metalsmith, done) => {
  const VALID_COLLECTIONS = Object.keys(collections);

  const brokenCollections = Object.keys(files)
    .filter(
      fileName =>
        path.extname(fileName) === '.html' || path.extname(fileName) === '.md',
    )
    // returns an Array of Error messages for pages that have collection errors
    .reduce((accum, key) => {
      const file = files[key];

      // Checks whether a page has a collection which is an Array. A page can have more then 1 collection
      if (file.collection) {
        if (
          file.collection.constructor.name === 'Array' &&
          file.collection.length > 0
        ) {
          file.collection.forEach(collectionName => {
            // Checks if the collection is valid
            if (!VALID_COLLECTIONS.includes(collectionName)) {
              accum.push(
                `Error: Your { collection: "${collectionName}" }, does not exist in the collection: ${key}`,
              );
            }
          });
        } else if (
          file.collection.constructor.name === 'String' &&
          !VALID_COLLECTIONS.includes(file.collection)
        ) {
          accum.push(
            `Error: Your { collection: "${
              file.collection
            }" }, does not exist in the collection: ${key}`,
          );
        }
      }

      // Checks if a page children is valid. A child collection is always going to be a string
      if (file.children && !VALID_COLLECTIONS.includes(file.children)) {
        accum.push(
          `Error: Your { children: "${
            file.children
          }" }, does not exist in the collection: ${key}`,
        );
      }

      return accum;
    }, []);

  if (brokenCollections.length > 0) {
    console.warn(
      '\n \nBroken Collection Error: Your collection or children in your front-matter file is broken.',
    );
    brokenCollections.forEach(error => {
      console.warn(error);
    });

    done(new Error(`You have ${brokenCollections.length} broken collections`));
  }

  done();
};

module.exports = checkCollections;
