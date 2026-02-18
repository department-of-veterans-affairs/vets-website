/**
 * Utility for managing field name migrations between claimant and veteran
 *
 * This utility handles the migration of field names from older naming conventions
 * (using "claimant") to newer conventions (using "veteran") while maintaining
 * backward compatibility.
 *
 * @module utils/field-name-migration
 */

/**
 * Field name mappings from old (claimant) to new (veteran) conventions
 */
const FIELD_NAME_MAPPINGS = {
  // Personal information fields
  claimantFullName: 'veteranFullName',
  claimantDateOfBirth: 'veteranDateOfBirth',
  claimantSocialSecurityNumber: 'veteranSocialSecurityNumber',
  claimantVaFileNumber: 'veteranVaFileNumber',

  // Contact information
  claimantAddress: 'veteranAddress',
  claimantPhone: 'veteranPhone',
  claimantEmail: 'veteranEmail',
  claimantMobilePhone: 'veteranMobilePhone',

  // Review pages
  'claimant-information': 'veteran-information',
  'claimant-information-review': 'veteran-information-review',

  // Schema sections
  claimantInfo: 'veteranInfo',
  claimantDetails: 'veteranDetails',
  claimantData: 'veteranData',
};

/**
 * Reverse mapping for backward compatibility
 */
const REVERSE_FIELD_MAPPINGS = Object.entries(FIELD_NAME_MAPPINGS).reduce(
  (acc, [oldName, newName]) => ({
    ...acc,
    [newName]: oldName,
  }),
  {},
);

/**
 * Migrates old field names to new field names in an object
 *
 * @param {Object} data - The data object containing fields to migrate
 * @param {Object} options - Migration options
 * @param {boolean} [options.deep=true] - Whether to recursively migrate nested objects
 * @param {boolean} [options.preserveOriginal=false] - Whether to keep original fields
 * @returns {Object} New object with migrated field names
 *
 * @example
 * const oldData = {
 *   claimantFullName: { first: 'John', last: 'Doe' },
 *   claimantDateOfBirth: '1980-01-01'
 * };
 *
 * const newData = migrateFieldNames(oldData);
 * // Returns: {
 * //   veteranFullName: { first: 'John', last: 'Doe' },
 * //   veteranDateOfBirth: '1980-01-01'
 * // }
 */
export function migrateFieldNames(data, options = {}) {
  const { deep = true, preserveOriginal = false } = options;

  if (!data || typeof data !== 'object') {
    return data;
  }

  const result = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    const newKey = FIELD_NAME_MAPPINGS[key] || key;

    // Recursively migrate nested objects if deep option is true
    const newValue =
      deep && value && typeof value === 'object'
        ? migrateFieldNames(value, options)
        : value;

    // Add migrated field
    result[newKey] = newValue;

    // Preserve original field if requested
    if (preserveOriginal && newKey !== key) {
      result[key] = newValue;
    }
  }

  return result;
}

/**
 * Migrates new field names back to old field names (for backward compatibility)
 *
 * @param {Object} data - The data object containing fields to reverse migrate
 * @param {Object} options - Migration options (same as migrateFieldNames)
 * @returns {Object} New object with old field names
 *
 * @example
 * const newData = {
 *   veteranFullName: { first: 'John', last: 'Doe' },
 *   veteranDateOfBirth: '1980-01-01'
 * };
 *
 * const oldData = reverseFieldNames(newData);
 * // Returns: {
 * //   claimantFullName: { first: 'John', last: 'Doe' },
 * //   claimantDateOfBirth: '1980-01-01'
 * // }
 */
export function reverseFieldNames(data, options = {}) {
  const { deep = true, preserveOriginal = false } = options;

  if (!data || typeof data !== 'object') {
    return data;
  }

  const result = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    const oldKey = REVERSE_FIELD_MAPPINGS[key] || key;

    // Recursively reverse nested objects if deep option is true
    const newValue =
      deep && value && typeof value === 'object'
        ? reverseFieldNames(value, options)
        : value;

    // Add reversed field
    result[oldKey] = newValue;

    // Preserve original field if requested
    if (preserveOriginal && oldKey !== key) {
      result[key] = newValue;
    }
  }

  return result;
}

/**
 * Creates a field name migration middleware for form data transformations
 *
 * @param {Object} config - Middleware configuration
 * @param {boolean} [config.toNew=true] - Direction of migration (true: old->new, false: new->old)
 * @param {string[]} [config.include] - Array of field names to include (if not provided, migrates all)
 * @param {string[]} [config.exclude] - Array of field names to exclude
 * @returns {Function} Middleware function that can be used in data pipelines
 *
 * @example
 * const migrationMiddleware = createFieldMigrationMiddleware({
 *   toNew: true,
 *   exclude: ['claimantSignature']
 * });
 *
 * const transformedData = migrationMiddleware(formData);
 */
export function createFieldMigrationMiddleware(config = {}) {
  const { toNew = true, include = null, exclude = [] } = config;

  return data => {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const migrationFunction = toNew ? migrateFieldNames : reverseFieldNames;
    const mappings = toNew ? FIELD_NAME_MAPPINGS : REVERSE_FIELD_MAPPINGS;

    // If include list is provided, only migrate specified fields
    if (include && include.length > 0) {
      const result = { ...data };
      for (const field of include) {
        if (field in data && field in mappings && !exclude.includes(field)) {
          const newField = mappings[field];
          result[newField] = data[field];
          delete result[field];
        }
      }
      return result;
    }

    // Otherwise, migrate all fields except excluded ones
    const dataToMigrate = { ...data };
    for (const field of exclude) {
      delete dataToMigrate[field];
    }

    const migratedData = migrationFunction(dataToMigrate);

    // Re-add excluded fields
    for (const field of exclude) {
      if (field in data) {
        migratedData[field] = data[field];
      }
    }

    return migratedData;
  };
}

/**
 * Gets the new field name for a given old field name
 *
 * @param {string} oldFieldName - The old field name
 * @returns {string} The new field name, or the original if no mapping exists
 */
export function getNewFieldName(oldFieldName) {
  return FIELD_NAME_MAPPINGS[oldFieldName] || oldFieldName;
}

/**
 * Gets the old field name for a given new field name
 *
 * @param {string} newFieldName - The new field name
 * @returns {string} The old field name, or the original if no mapping exists
 */
export function getOldFieldName(newFieldName) {
  return REVERSE_FIELD_MAPPINGS[newFieldName] || newFieldName;
}

/**
 * Checks if a field name has a migration mapping
 *
 * @param {string} fieldName - The field name to check
 * @returns {boolean} True if the field has a mapping
 */
export function hasFieldMapping(fieldName) {
  return (
    fieldName in FIELD_NAME_MAPPINGS || fieldName in REVERSE_FIELD_MAPPINGS
  );
}

/**
 * Gets all field name mappings
 *
 * @returns {Object} Object containing both forward and reverse mappings
 */
export function getAllFieldMappings() {
  return {
    forward: { ...FIELD_NAME_MAPPINGS },
    reverse: { ...REVERSE_FIELD_MAPPINGS },
  };
}

/**
 * Validates that migrated data contains expected fields
 *
 * @param {Object} data - The data to validate
 * @param {string[]} requiredFields - Array of required field names
 * @param {boolean} [useNewNames=true] - Whether to check for new or old field names
 * @returns {Object} Validation result with { valid: boolean, missingFields: string[] }
 */
export function validateMigratedFields(
  data,
  requiredFields,
  useNewNames = true,
) {
  const missingFields = [];

  for (const field of requiredFields) {
    const fieldToCheck = useNewNames
      ? getNewFieldName(field)
      : getOldFieldName(field);

    if (!(fieldToCheck in data)) {
      missingFields.push(fieldToCheck);
    }
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

// Export mappings for direct access if needed
export { FIELD_NAME_MAPPINGS, REVERSE_FIELD_MAPPINGS };
