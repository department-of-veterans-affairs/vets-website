import { cloneDeep } from 'lodash';
import { discontinuedIncomeTypeLabels } from '../labels';
import { REGEXP } from '../constants';

/**
 * Build a full name string from an object containing first/middle/last
 * @param {Object} fullName Object to be destructured for flattening
 * @param {string} first First name to be processed
 * @param {string} middle Middle name to be processed
 * @param {string} last Last name to be processed
 * @returns {string} A single string combining the provided name parts,
 * with undefined or empty parts removed and separated by spaces
 */
export function flattenRecipientName({ first, middle, last }) {
  // Filter out undefined values and join with spaces
  const parts = [first, middle, last].filter(part => !!part);

  // Join remaining parts with space and trim extra spaces
  return parts.join(' ').trim();
}

/**
 * Collect all attachment objects from the form data, specifically from the trusts
 * and ownedAssets arrays.
 * @param {Object} data the form data object
 * @returns {Array} an array of all attachment objects found in the data
 */
export function collectAttachmentFiles(data) {
  const attachments = [];

  const { trusts = [] } = data;

  trusts.forEach(trust => {
    if (trust.uploadedDocuments) {
      // Spread to avoid nested arrays
      attachments.push(...trust.uploadedDocuments);
    }
  });

  const assets = data.ownedAssets || [];
  assets.forEach(asset => {
    if (asset.uploadedDocuments && !Array.isArray(asset.uploadedDocuments)) {
      // Owned assets can only have one supporting document each
      attachments.push(asset.uploadedDocuments);
    }
  });

  return attachments;
}

/**
 * Applies conditional removal rules to an object.
 * @param {Object} obj - The object to transform (mutates clone, not original).
 * @param {Array} rules - Array of rule objects:
 *   { field, when(value, obj), remove: [] }
 * @returns {Object} A new transformed object.
 */
export function pruneFields(obj, rules = []) {
  const result = cloneDeep(obj);

  for (const rule of rules) {
    const { field, when, remove = [] } = rule;
    const value = result[field];

    if (typeof when === 'function' && when(value, result)) {
      for (const key of remove) {
        delete result[key];
      }
    }
  }

  return result;
}

/**
 * Apply `pruneFields` to each object within an array using the provided rules.
 * @param {Array<Object>} arr - The array of objects to be processed.
 * @param {Array<string|Object>} [rules=[]] - A list of pruning rules to be
 * applied to each item. These rules are passed directly to `pruneFields`.
 * @returns {Array<Object>} A new array where each item has been pruned according
 * to the supplied rules.
 */
export function pruneFieldsInArray(arr = [], rules = []) {
  if (!Array.isArray(arr)) return arr;
  if (!rules?.length) return arr;

  return arr.map(item => pruneFields(item, rules));
}

/**
 * Prune fields within configured array-type properties on a form data object.
 * For each key listed in `config`, if the corresponding value in `formData`
 * is an array, each item in that array will be pruned using the given rules.
 * @param {Object} formData - The full form data object to prune.
 * @param {Object} config - A mapping of array field names to pruning rules.
 * @returns {Object} A shallow-cloned version of `formData` with applicable
 * array fields pruned according to the configuration.
 */
export function pruneConfiguredArrays(formData = {}, config = {}) {
  const result = { ...formData };

  for (const key of Object.keys(config)) {
    const rules = config[key];

    if (Array.isArray(result[key])) {
      result[key] = pruneFieldsInArray(result[key], rules);
    }
  }

  return result;
}

/**
 * Remap `otherVeteran*` fields to their corresponding `veteran*` fields
 * for cases where the claimant is not the veteran.
 * @param {Object} [data={}] - The form data object containing possible `otherVeteran*`
 * fields to be remapped.
 * @param {Object} [data.otherVeteranFullName] - Full name object to map to `veteranFullName`.
 * @param {string} [data.otherVeteranSocialSecurityNumber] - SSN to map to `veteranSocialSecurityNumber`.
 * @param {string} [data.otherVaFileNumber] - VA file number to map to `vaFileNumber`.
 * @returns {Object} A shallow-cloned copy of the input data with any applicable
 * `otherVeteran*` fields remapped to their `veteran*` equivalents.
 */
export function remapOtherVeteranFields(data = {}) {
  const updated = { ...data };

  if (data.otherVeteranFullName) {
    updated.veteranFullName = data.otherVeteranFullName;
  }

  if (data.otherVeteranSocialSecurityNumber) {
    updated.veteranSocialSecurityNumber = data.otherVeteranSocialSecurityNumber;
  }

  if (data.otherVaFileNumber) {
    updated.vaFileNumber = data.otherVaFileNumber;
  }

  return updated;
}

/**
 * Remap recipientRelationship for certain claimant types when the relationship is "SPOUSE".
 *
 * This function applies ONLY when:
 *   - claimantType is "CUSTODIAN" or "PARENT"
 *   - itemData.recipientRelationship === "SPOUSE"
 *
 * In those cases:
 *   - recipientRelationship → "OTHER"
 *   - otherRecipientRelationshipType → a descriptive label
 *       • "Custodian’s spouse" when claimantType is "CUSTODIAN"
 *       • "Parent’s spouse"     when claimantType is "PARENT"
 *
 * If none of the conditions match, the original item is returned unchanged.
 *
 * @param {string} claimantType - High-level claimant type from formData
 * @param {Object} itemData - The array item being transformed
 * @returns {Object} A new object with remapped fields when rules apply, otherwise the original item
 */
export function remapRecipientRelationshipFields(claimantType, itemData = {}) {
  const { recipientRelationship } = itemData;

  // Guard: only these claimant types ever have remapping rules
  const isEligibleClaimant =
    claimantType === 'CUSTODIAN' || claimantType === 'PARENT';

  if (!isEligibleClaimant) {
    return itemData;
  }

  // Guard: only remap spouse relationships
  const shouldTransform = recipientRelationship === 'SPOUSE';
  if (!shouldTransform) {
    return itemData;
  }

  // Using a straight apostrophe (') instead of a typographic apostrophe (’)
  // to avoid downstream PDF encoding issues where U+2019 is rendered as '?'.
  const label =
    claimantType === 'CUSTODIAN' ? "Custodian's spouse" : "Parent's spouse";

  return {
    ...itemData,
    recipientRelationship: 'OTHER',
    otherRecipientRelationshipType: label,
  };
}

/**
 * Remap recipientRelationship fields across all array-based chapters
 * of the 0969 form (except the `files` array).
 *
 * This function iterates over every key in form data. For any key whose
 * value is a non-empty array, each item in the array is inspected:
 *
 * - If an item contains a `recipientRelationship` field, it will be passed
 *   to `remapRecipientRelationshipFields` along with the form's claimantType.
 *
 * - Items that do not contain `recipientRelationship` are left untouched.
 *
 * - The `files` array is explicitly ignored and never modified.
 *
 * This is intended to support claimant types such as "CUSTODIAN" or "PARENT",
 * where "SPOUSE" must be converted into:
 *   - recipientRelationship: "OTHER"
 *   - otherRecipientRelationshipType: "<Custodian’s|Parent’s> spouse"
 *
 * @param {Object} formData - The full form data object before submission.
 * @param {string} formData.claimantType - The claimant type used to determine remapping rules.
 * @returns {Object} A shallow clone of formData with adjusted array sections where applicable.
 */
export function remapRecipientRelationshipsInArrays(formData) {
  const { claimantType } = formData;
  const result = { ...formData };

  Object.entries(formData).forEach(([key, value]) => {
    if (key === 'files') return; // skip file uploads entirely

    if (Array.isArray(value) && value.length > 0) {
      result[key] = value.map(
        item =>
          item && item.recipientRelationship
            ? remapRecipientRelationshipFields(claimantType, item)
            : item,
      );
    }
  });

  return result;
}

/**
 * Remap the incomeType field of a discontinued income object
 * to its human-readable label for submission.
 *
 * Special case:
 * - If `incomeType` is "OTHER", the value will be replaced with
 *   the value of the `view:otherIncomeType` field instead of the default label.
 *
 * This is intended to be used as an iterator inside transform logic, e.g.:
 *   form.data.discontinuedIncomes.map(remapIncomeTypeFields)
 *
 * @param {Object} itemData - A single discontinued income object
 * @param {string} itemData.incomeType - The raw income type key
 * @param {string} [itemData['view:otherIncomeType'] - Required description if incomeType is OTHER
 * @returns {Object} A new object with incomeType replaced by its label or 'view:otherIncomeType'
 */
export function remapIncomeTypeFields(itemData = {}) {
  const { incomeType } = itemData;
  const otherValue = itemData['view:otherIncomeType'];

  let mappedIncomeType;

  if (incomeType === 'OTHER' && otherValue) {
    mappedIncomeType = otherValue;
  } else {
    mappedIncomeType = discontinuedIncomeTypeLabels[incomeType] ?? incomeType;
  }

  return {
    ...itemData,
    incomeType: mappedIncomeType,
  };
}

/**
 * Remove fields that are not allowed to be submitted from form data object.
 * @param {Object} data - The form data object where fields may be removed.
 * @param {Array} disallowedFields -  The array of disallowed fields.
 * @returns {Object} A deep-cloned copy of the original form with disallowed fields
 * removed from the `data` property, leaving all other fields intact.
 */
export function removeDisallowedFields(data, disallowedFields) {
  const cleanedData = cloneDeep(data);

  // Remove disallowed fields from the data
  disallowedFields.forEach(field => {
    if (cleanedData[field] !== undefined) {
      delete cleanedData[field];
    }
  });

  return cleanedData;
}

/**
 * Recursively removes fields that match deletion rules.
 *
 * Rules:
 * - deletes undefined
 * - deletes null
 * - deletes keys starting with "view:"
 *
 * Works for shallow fields and any nested object/array.
 *
 * @param {any} input description
 * @returns {any} new cleaned structure
 */
export function removeInvalidFields(input) {
  if (Array.isArray(input)) {
    // Process each item recursively and filter out empty/null items
    return input
      .map(item => removeInvalidFields(item))
      .filter(item => item !== undefined && item !== null);
  }

  if (input && typeof input === 'object') {
    const result = {};

    Object.keys(input).forEach(key => {
      const value = input[key];

      const shouldDelete =
        value === undefined || value === null || key.startsWith('view:');

      if (shouldDelete) {
        return;
      }

      const cleaned = removeInvalidFields(value);

      if (cleaned !== undefined && cleaned !== null) {
        result[key] = cleaned;
      }
    });
    return result;
  }
  return input;
}

/**
 * Custom replacer for JSON.stringify used to clean empty/null objects
 * and flatten recipientName objects.
 * @param {string} key The key of the property being processed
 * @param {*} value The value of the property being processed
 * @returns {*} Returns the cleaned or transformed value for JSON serialization,
 *  or `undefined` to omit the key from the final JSON
 */
export function replacer(key, value) {
  // Clean up empty objects, which we have no reason to send
  if (typeof value === 'object' && value) {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }
  }

  // Clean up null values, which we have no reason to send
  if (value === null) {
    return undefined;
  }

  if (key === 'recipientName') {
    // If the value is an object, flatten it to a string
    if (typeof value === 'object' && value !== null) {
      return flattenRecipientName(value);
    }
    // If it's already a string, return it as is
    return value;
  }

  // Normalize claimant phone number if it exists (removes dashes)
  if (key === 'claimantPhone' && typeof value === 'string' && value !== null) {
    return value.replace(REGEXP.NON_DIGIT, '');
  }

  return value;
}
