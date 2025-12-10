import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { allergyTypes } from './constants';

/**
 * Default empty field values used by Medical Records.
 * Medications app can override these via options.
 */
const DEFAULT_EMPTY_FIELD = 'None recorded';

/**
 * Check if a value is an array and has at least one item.
 * Private helper function used internally by allergy converters.
 *
 * @param {Any} obj - Value to check
 * @returns {Boolean} true if obj is an array and has at least one item
 */
const isArrayAndHasItems = obj => {
  return Array.isArray(obj) && obj.length;
};

/**
 * Extract a contained resource from a FHIR resource's "contained" array.
 * Private helper function used internally by allergy converters.
 *
 * @param {Object} resource - A FHIR resource (e.g. AllergyIntolerance)
 * @param {String} referenceId - An internal ID referencing a contained resource
 * @returns {Object|null} The specified contained FHIR resource, or null if not found
 */
const extractContainedResource = (resource, referenceId) => {
  if (resource && isArrayAndHasItems(resource.contained) && referenceId) {
    // Strip the leading "#" from the reference.
    const strippedRefId = referenceId.substring(1);
    const containedResource = resource.contained.find(
      containedItem => containedItem.id === strippedRefId,
    );
    return containedResource || null;
  }
  return null;
};

/**
 * Extract reactions/manifestations from a FHIR AllergyIntolerance resource.
 * This function is used by both Medical Records and Medications apps.
 *
 * @param {Object} record - FHIR AllergyIntolerance resource
 * @returns {Array<string>} Array of reaction/manifestation text values
 */
export const getReactions = record => {
  const reactions = [];
  if (!record || !record.reaction) return reactions;
  record.reaction.forEach(reaction => {
    if (isArrayAndHasItems(reaction.manifestation)) {
      reaction.manifestation.forEach(manifestation => {
        reactions.push(manifestation.text);
      });
    }
  });
  return reactions;
};

/**
 * Extract location from a FHIR AllergyIntolerance resource.
 * This is a private helper function used by convertAllergy.
 *
 * @param {Object} allergy - FHIR AllergyIntolerance resource
 * @param {string} emptyField - Value to return when location is not found
 * @returns {string} Location name or empty field value
 */
const extractLocation = (allergy, emptyField) => {
  if (isArrayAndHasItems(allergy?.recorder?.extension)) {
    const ref = allergy.recorder.extension[0]?.valueReference?.reference;
    const org = extractContainedResource(allergy, ref);
    if (org?.name) {
      return org.name;
    }
  }
  return emptyField;
};

/**
 * Extract observed/reported status from a FHIR AllergyIntolerance resource.
 * This is a private helper function used by convertAllergy.
 *
 * @param {Object} allergy - FHIR AllergyIntolerance resource
 * @param {string} emptyField - Value to return when status is not found
 * @returns {string} Observed/reported status or empty field value
 */
const extractObservedReported = (allergy, emptyField) => {
  if (allergy && isArrayAndHasItems(allergy.extension)) {
    const extItem = allergy.extension.find(
      item => item.url && item.url.includes('allergyObservedHistoric'),
    );
    if (extItem?.valueCode) {
      if (extItem.valueCode === 'o') return allergyTypes.OBSERVED;
      if (extItem.valueCode === 'h') return allergyTypes.REPORTED;
    }
  }
  return emptyField;
};

/**
 * Convert a FHIR AllergyIntolerance resource to a normalized allergy object.
 * Used for v1 API responses.
 *
 * @param {Object} allergy - FHIR AllergyIntolerance resource
 * @param {Object} options - Configuration options
 * @param {string} options.emptyField - Value for missing fields (default: 'None recorded')
 * @param {string} options.noneNotedField - Value for notes/name when none (default: same as emptyField)
 * @param {boolean} options.includeProvider - Whether to include provider field (default: true)
 * @param {boolean} options.joinAllCategories - Whether to join all categories or use first only (default: true)
 * @returns {Object} Normalized allergy object
 */
export const convertAllergy = (allergy, options = {}) => {
  const {
    emptyField = DEFAULT_EMPTY_FIELD,
    noneNotedField = emptyField,
    includeProvider = true,
    joinAllCategories = true,
  } = options;

  // Handle type/category formatting
  let type = emptyField;
  if (isArrayAndHasItems(allergy.category)) {
    if (joinAllCategories) {
      // Medical Records: join all categories with comma
      type = allergy.category
        .join(', ')
        .replace(/^./, char => char.toUpperCase());
    } else {
      // Medications: use only first category
      type =
        allergy.category[0].charAt(0).toUpperCase() +
        allergy.category[0].slice(1);
    }
  }

  const result = {
    id: allergy.id,
    type,
    name: allergy?.code?.text || noneNotedField,
    date: allergy?.recordedDate
      ? formatDateLong(allergy.recordedDate)
      : emptyField,
    reaction: getReactions(allergy),
    location: extractLocation(allergy, emptyField),
    observedOrReported: extractObservedReported(allergy, emptyField),
    notes:
      (isArrayAndHasItems(allergy.note) && allergy.note[0]?.text) ||
      noneNotedField,
  };

  // Only include provider if requested (Medical Records includes it, Medications doesn't)
  if (includeProvider) {
    result.provider = allergy.recorder?.display || emptyField;
  }

  return result;
};

/**
 * Convert a unified API allergy response to a normalized allergy object.
 * Used for v2 unified endpoint responses.
 *
 * @param {Object} allergy - Unified API allergy object (with attributes wrapper)
 * @param {Object} options - Configuration options
 * @param {string} options.emptyField - Value for missing fields (default: 'None recorded')
 * @returns {Object} Normalized allergy object
 */
export const convertUnifiedAllergy = (allergy, options = {}) => {
  const { emptyField = DEFAULT_EMPTY_FIELD } = options;

  const allergyData = allergy?.attributes || allergy;

  return {
    id: allergy.id,
    type:
      (isArrayAndHasItems(allergyData.categories) &&
        allergyData.categories
          .join(', ')
          .replace(/^./, char => char.toUpperCase())) ||
      emptyField,
    name: allergyData?.name || emptyField,
    date: allergyData?.date ? formatDateLong(allergyData.date) : emptyField,
    reaction: allergyData?.reactions || emptyField,
    location: allergyData?.location || emptyField,
    observedOrReported: (() => {
      if (allergyData?.observedHistoric) {
        return allergyData.observedHistoric === 'o'
          ? allergyTypes.OBSERVED
          : allergyTypes.REPORTED;
      }
      return emptyField;
    })(),
    notes:
      (isArrayAndHasItems(allergyData.notes) && allergyData.notes.join(' ')) ||
      emptyField,
    provider: allergyData?.provider || emptyField,
    sortKey: allergyData?.date ? new Date(allergyData.date) : null,
    // Note: The v2 unified endpoint combines both Oracle Health and VistA data sources
    // into a single normalized format. The backend does not provide a data source field
    // to distinguish between them. We set isOracleHealthData to true for all v2 records
    // because the unified format uses the same display logic as Oracle Health data
    // (with provider, location, and other OH-style fields). Components check this flag
    // to determine which template to use for rendering.
    isOracleHealthData: true,
  };
};
