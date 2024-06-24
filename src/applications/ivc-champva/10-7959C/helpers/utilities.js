import _ from 'lodash';

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
  let retVal = '';
  // NOTE: certifierRole isn't used in this form anymore so this will always
  // skip to else clause
  if (formData?.certifierRole === 'applicant') {
    retVal = isPosessive ? 'your' : 'you';
  } else {
    // Concatenate all parts of applicant's name (first, middle, etc...)
    retVal = firstNameOnly
      ? formData?.applicantName?.first
      : Object.values(formData?.applicantName || {})
          .filter(el => el)
          .join(' ');
    retVal = isPosessive ? `${retVal}’s` : retVal;
  }

  // Optionally capitalize first letter and return
  return cap ? retVal?.charAt(0)?.toUpperCase() + retVal?.slice(1) : retVal;
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
