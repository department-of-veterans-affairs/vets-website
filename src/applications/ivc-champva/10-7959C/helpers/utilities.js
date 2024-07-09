import _ from 'lodash';
import { nameWording as sharedNameWording } from '../../shared/utilities';

export function isRequiredFile(formContext, requiredFiles) {
  return Object.keys(formContext?.schema?.properties || {}).filter(v =>
    Object.keys(requiredFiles).includes(v),
  ).length >= 1
    ? '(Required)'
    : '(Optional)';
}

// Return either 'your' or the applicant's name depending
export function nameWording(
  formData,
  isPosessive = true,
  cap = true,
  firstNameOnly = false,
) {
  // Moved contents of this function to shared utilities file,
  // leaving this stub in place so existing imports still work.
  // TODO: update all imports of nameWording to point directly to shared
  return sharedNameWording(formData, isPosessive, cap, firstNameOnly);
}

/**
 * Retrieves an array of objects containing the property 'attachmentId'
 * from the given object.
 *
 * @param {Object} obj - The input object to search for objects with 'attachmentId'.
 * @returns {Array} - An array containing objects with the 'attachmentId' property.
 */
export function getObjectsWithAttachmentId(obj) {
  const objectsWithAttachmentId = [];
  _.forEach(obj, value => {
    if (_.isArray(value)) {
      _.forEach(value, item => {
        if (_.isObject(item) && _.has(item, 'attachmentId')) {
          objectsWithAttachmentId.push(item);
        }
      });
    }
  });

  return objectsWithAttachmentId;
}
