import omit from './omit';
import set from './set';

function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'object' && !Object.keys(value).length)
  );
}

/**
 * Remove any deeply empty objects.
 * Note: This function is non-mutative; it'll return a new object without the empty properties.
 *
 * @param {Object} root - The object we're checking
 * @param {Function} isEmpty - A callback to determine if a value should be considered empty
 */
export default function removeDeeplyEmptyObjects(root, checkEmpty = isEmpty) {
  // Check for null because typeof null === 'object', of course. Thanks JavaScript.
  if (typeof root !== 'object' || root === null) {
    return root;
  }
  if (Array.isArray(root)) {
    // see va.gov-team/issues/30211
    return root.map(arrayItem => removeDeeplyEmptyObjects(arrayItem));
  }

  let newRoot = root;
  const emptyKeys = Object.keys(newRoot).filter(key => {
    // Recurse as deeply as possible first
    if (!checkEmpty(newRoot[key])) {
      const newProp = removeDeeplyEmptyObjects(newRoot[key]);
      // set() changes the object reference, but we don't want that if the property reference doesn't change
      if (newProp !== newRoot[key]) {
        newRoot = set(key, newProp, newRoot);
      }
    }

    // Add the key to the list if the property is now empty
    return checkEmpty(newRoot[key]);
  });

  return omit(emptyKeys, newRoot);
}
