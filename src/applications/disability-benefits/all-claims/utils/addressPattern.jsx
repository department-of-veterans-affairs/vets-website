import {
  addressUI,
  addressSchema,
  schemaCrossXRef,
  updateFormDataAddress,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern';

/**
 * Creates a mapping wrapper for addressUI that allows field keys to be renamed
 * in the schema. Useful for forms that have multiple address fields
 * with different key names.
 * ```js
 * schema: {
 *   mailingAddress: mappedAddressUI({
 *     keyMap: {
 *       street: 'addressLine1',
 *       street2: 'addressLine2',
 *       street3: 'addressLine3',
 *       postalCode: 'zipCode'
 *     }
 *   })
 *   legacyAddress: mappedAddressUI({
 *     keyMap: {
 *       postalCode: 'zipCode'
 *     },
 *     omit: ['street2', 'street3']
 *   })
 * }
 * ```
 * @param {Object} options
 * @param {Object} options.keyMap - Mapping of standard keys to custom keys
 * @param {Object} [options.labels] - Custom field labels
 * @param {Array<string>} [options.omit] - Fields to omit (use standard keys)
 * @param {boolean | Object} [options.required] - Required field configuration
 * @returns {UISchemaOptions}
 */
export const mappedAddressUI = (options = {}) => {
  const { keyMap = {}, ...addressOptions } = options;

  // Get the base address UI schema using standard keys
  const baseSchema = addressUI(addressOptions);
  const mappedSchema = {};

  // Create reverse key map for easier lookup
  Object.entries(baseSchema).forEach(([standardKey, fieldConfig]) => {
    const customKey = keyMap[standardKey] || standardKey;

    // Skip if omitted
    if (addressOptions.omit?.includes(standardKey)) {
      return;
    }

    mappedSchema[customKey] = fieldConfig;
  });

  return mappedSchema;
};

/**
 * Creates a mapping wrapper for addressSchema that renames field keys
 *
 * ```js
 * schema: {
 *   mailingAddress: mappedAddressSchema({
 *     keyMap: {
 *       street: 'addressLine1',
 *       street2: 'addressLine2',
 *       street3: 'addressLine3',
 *       postalCode: 'zipCode'
 *     }
 *   })
 * }
 * ```
 * @param {Object} options
 * @param {Object} options.keyMap - Mapping of standard keys to custom keys
 * @param {Array<string>} [options.omit] - Fields to omit (use standard keys)
 * @returns {SchemaOptions}
 */
export const mappedAddressSchema = (options = {}) => {
  const { keyMap = {}, ...schemaOptions } = options;

  // Get the base address schema
  const baseSchema = addressSchema(schemaOptions);
  const mappedProperties = {};

  // Map each property to its custom key
  Object.entries(baseSchema.properties).forEach(
    ([standardKey, propertyConfig]) => {
      const customKey = keyMap[standardKey] || standardKey;
      // Skip if this field is omitted
      if (
        schemaOptions.omit?.includes(standardKey) ||
        schemaOptions.omit?.includes(customKey)
      ) {
        return;
      }

      mappedProperties[customKey] = propertyConfig;
    },
  );

  return {
    ...baseSchema,
    properties: mappedProperties,
  };
};

/**
 * Helper function to update form data for mapped addresses
 * Use this in place of updateFormDataAddress when using mapped keys
 */
export const updateMappedFormDataAddress = (
  oldFormData,
  formData,
  path,
  index = null,
  keyMap = {},
) => {
  // Create schema keys mapping that includes the custom key mappings
  const mappedSchemaKeys = { ...schemaCrossXRef };

  // Override with custom key mappings
  Object.entries(keyMap).forEach(([standardKey, customKey]) => {
    // Find the schema cross reference for this standard key
    const schemaKey = Object.keys(schemaCrossXRef).find(
      key => schemaCrossXRef[key] === standardKey,
    );
    if (schemaKey) {
      mappedSchemaKeys[schemaKey] = customKey;
    }
  });

  return updateFormDataAddress(
    oldFormData,
    formData,
    path,
    index,
    mappedSchemaKeys,
  );
};
