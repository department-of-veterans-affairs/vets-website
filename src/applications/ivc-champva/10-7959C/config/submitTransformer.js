import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

/**
 * Convert a list of strings into an object with boolean
 * keys indicating the presence or absence of a key. E.g.,
 * if given list ['prop1', 'prop2'], return would be:
 * {is_prop1: true, is_prop2: true}
 * @param {array} listOfStr List of health insurance types (e.g., ['ppo', 'medigap'])
 * @returns Object of boolean properties based on list of strings provided, e.g.,:
 * {is_prop1: true, is_prop2: true}
 */
function listOfStrToBools(listOfStr) {
  let retVal = {};
  if (listOfStr !== undefined) {
    listOfStr
      .map(key => {
        return { [`is_${key}`]: true };
      })
      .forEach(obj => {
        retVal = { ...retVal, ...obj };
      });
  }
  return retVal;
}

/**
 * This function recursively finds all object properties with a value of "yes" or "no"
 * and converts those values in-place to booleans. E.g., if provided obj = {prop1: "yes"},
 * will modify obj so that it === {prop1: true}.
 * @param {object} data Object we're searching for string values to convert to bools
 * @param {number} depth Current recursion depth (used to prevent runaway)
 * @param {number} maxDepth Maximum recursion depth
 * @returns undefined, operates on obj in place
 */
function yesNoToBool(data, depth = 0, maxDepth = 5) {
  const obj = data;
  // Prevent infinite recursion if we somehow have self-referencing object
  if (depth > maxDepth) return;
  // Check all keys on current object and recurse if necessary
  Object.keys(obj).forEach(k => {
    if (obj[k] === 'yes') obj[k] = true;
    else if (obj[k] === 'no') obj[k] = false;
    else if (typeof obj[k] === 'object')
      yesNoToBool(obj[k], depth + 1, maxDepth);
  });
}

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  // Convert insurance types to array of boolean keys
  transformedData.applicants.forEach(el => {
    const app = el; // Updates will be in-place
    app.applicantPrimaryInsuranceType = listOfStrToBools(
      app?.applicantPrimaryInsuranceType?.split(',').map(v => v.trim()),
    );
    app.applicantSecondaryInsuranceType = listOfStrToBools(
      app?.applicantSecondaryInsuranceType?.split(',').map(v => v.trim()),
    );
  });

  // Convert all "yes" or "no" values to true booleans
  const copyOfData = JSON.parse(JSON.stringify(transformedData));
  yesNoToBool(copyOfData);

  return JSON.stringify({
    ...copyOfData,
    formNumber: formConfig.formId,
  });
}
