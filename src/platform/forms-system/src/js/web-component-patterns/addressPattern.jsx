/**
 * Web component version of address
 */
import environment from 'platform/utilities/environment';
import React from 'react';
import constants from 'vets-json-schema/dist/constants.json';

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import utilsOmit from 'platform/utilities/data/omit';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaTextInputField from '../web-component-fields/VaTextInputField';
import VaSelectField from '../web-component-fields/VaSelectField';
import VaCheckboxField from '../web-component-fields/VaCheckboxField';
import VaRadioField from '../web-component-fields/VaRadioField';

/**
 * PATTERNS
 * NONBLANK_PATTERN - rejects white space only
 * STATE_PROVINCE_PATTERN - allows alphanumeric, spaces, hyphens, apostrophes for international regions
 * POSTAL_CODE_PATTERNS - Matches US/Mexican/Canadian codes
 */
const NONBLANK_PATTERN = '^.*\\S.*';
const STATE_PROVINCE_PATTERN = "^[a-zA-Z0-9\\s'-]+$";
const POSTAL_CODE_PATTERNS = {
  CAN:
    '^(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\s{0,1}\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d$',
  MEX: '^\\d{5}$',
  USA: '^\\d{5}$',
};

const POSTAL_CODE_PATTERN_ERROR_MESSAGES = {
  CAN: {
    required: 'Enter a postal code',
    pattern: 'Enter a valid 6-character postal code',
  },
  MEX: {
    required: 'Enter a postal code',
    pattern: 'Enter a valid 5-digit postal code',
  },
  USA: {
    required: 'Enter a zip code',
    pattern: 'Enter a valid 5-digit zip code',
  },
  NONE: {
    required: 'Enter a postal code',
    pattern: 'Enter a valid postal code',
  },
  OTHER: {
    required:
      'Enter a postal code that meets your country’s requirements. If your country doesn’t require a postal code, enter NA.',
    pattern: 'Enter a valid postal code',
  },
};

const CITY_ERROR_MESSAGES_DEFAULT = {
  required: 'Enter a city',
  pattern: 'Enter a city',
};

const CITY_ERROR_MESSAGES_MILITARY = {
  required: 'Select a type of post office: APO, FPO, or DPO',
  enum: 'Select a type of post office: APO, FPO, or DPO',
};

const STATE_LABEL_USA = 'State';
const STATE_ERROR_MESSAGES_USA = {
  required: 'Select a state',
  enum: 'Select a state',
};

const STATE_LABEL_CAN = 'Province or territory';
const STATE_ERROR_MESSAGES_CAN = {
  required: 'Select a province or territory',
  enum: 'Select a province or territory',
};

const STATE_LABEL_MEX = 'State';
const STATE_ERROR_MESSAGES_MEX = {
  required: 'Select a state',
  enum: 'Select a state',
};

const STATE_LABEL_MILITARY = 'Overseas "state" abbreviation';
const STATE_ERROR_MESSAGES_MILITARY = {
  required: 'Select an abbreviation: AA, AE, or AP',
  enum: 'Select an abbreviation: AA, AE, or AP',
};

const STATE_LABEL_DEFAULT = 'State, province, or region';
const STATE_ERROR_MESSAGES_DEFAULT = {
  required: 'Enter a valid state, province, or region',
  enum: 'Enter a valid state, province, or region',
  pattern: 'Enter a valid state, province, or region',
};

const MILITARY_CITIES = [
  {
    label: 'APO (Air or Army post office)',
    value: 'APO',
  },
  {
    label: 'FPO (Fleet post office)',
    value: 'FPO',
  },
  {
    label: 'DPO (Diplomatic post office)',
    value: 'DPO',
  },
];

const MILITARY_STATES = [
  {
    label:
      'AA (Armed Forces America) - North and South America, excluding Canada',
    value: 'AA',
  },
  {
    label:
      'AE (Armed Forces Europe) - Africa, Canada, Europe, and the Middle East',
    value: 'AE',
  },
  {
    label: 'AP (Armed Forces Pacific) - Pacific',
    value: 'AP',
  },
];

const MILITARY_CITY_TITLE = 'Military post office';
const MILITARY_CITY_VALUES = MILITARY_CITIES.map(city => city.value);
const MILITARY_CITY_NAMES = MILITARY_CITIES.map(city => city.label);

const MILITARY_STATE_VALUES = MILITARY_STATES.map(state => state.value);
const MILITARY_STATE_NAMES = MILITARY_STATES.map(state => state.label);

const COUNTRY_VALUES = constants.countries.map(country => country.value);
const COUNTRY_NAMES = constants.countries.map(country => country.label);

// filtered States that include US territories
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);

const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);

const CAN_STATE_VALUES = constants.states.CAN.map(state => state.value);
const CAN_STATE_NAMES = constants.states.CAN.map(state => state.label);

const MEX_STATE_VALUES = constants.states.MEX.map(state => state.value);
const MEX_STATE_NAMES = constants.states.MEX.map(state => state.label);

const DEFAULT_KEYS = {
  isMilitary: 'isMilitary',
  'view:militaryBaseDescription': 'view:militaryBaseDescription',
  country: 'country',
  street: 'street',
  street2: 'street2',
  street3: 'street3',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
};

const MAPPABLE_KEYS = [
  'country',
  'city',
  'state',
  'street',
  'street2',
  'street3',
  'postalCode',
  'isMilitary',
];

const MAPPABLE_LABELS = [
  ...MAPPABLE_KEYS,
  'militaryCheckbox',
  'street2Military',
  'street3Military',
];

/**
 * CONSTANTS:
 * 2. USA - references USA value and label
 * 3. MilitaryBaseInfo - React component. Wrapped in AdditionalInfo component and used as description
 */

const USA = {
  value: 'USA',
  label: 'United States',
};

// TODO: Refactor for dynamic content
const MilitaryBaseInfo = () => (
  <div className="vads-u-padding-x--2p5">
    <va-additional-info trigger="Learn more about military base addresses">
      <span>
        The United States is automatically chosen as your country if you live on
        a military base outside of the country.
      </span>
    </va-additional-info>
  </div>
);

/**
 * insertArrayIndex - Used when addresses are nested in an array and need to be accessible.
 * There's no good way to handle pathing to a schema when it lives in an array with multiple entries.
 * Example: childrenToAdd[INDEX].childAddressInfo.address. Hardcoding an index value in place of INDEX
 * would just result in the same array entry being mutated over and over, instead of the correct entry.
 */
// TODO:
// const insertArrayIndex = (key, index) => key.replace('[INDEX]', `[${index}]`);

const getOldFormDataPath = (path, index) => {
  const indexToSlice = index !== null ? path.indexOf(index) + 1 : 0;
  return path.slice(indexToSlice);
};

// Temporary storage for city & state if military base checkbox is toggled more
// than once. Not ideal, but works since this code isn't inside a React widget
const savedAddress = {
  city: '',
  stateCode: '',
};

const getAddressPath = path => {
  // path examples:
  // ["employers", 0, "address", "postalCode"]
  // ["exampleArrayData", 0, "address", "country"]
  // ["wcv3Address", "country"]
  // ["address", "state"]
  return path.slice(0, -1);
};

// This is a helper function for getting a field value from address data, taking into account any mapped schema keys
export function getFieldValue(fieldName, addressData, keys = {}) {
  const mappedKey = keys[fieldName] || fieldName;
  return addressData?.[mappedKey];
}

function validateKeys(keys = [], methodName = '', fields = MAPPABLE_KEYS) {
  const invalidKeys = keys.filter(field => !fields.includes(field));

  if (!environment.isProduction() && invalidKeys.length > 0) {
    throw new Error(
      `${
        methodName ? `${methodName}: ` : ''
      }Invalid key mappings: ${invalidKeys.join(
        ', ',
      )}. Valid mappable fields are: ${fields.join(', ')}.`,
    );
  }
}

/**
 * Detects key collisions that would occur due to mapping
 */
function detectKeyCollisions(schema, keys = {}) {
  // Detect key collisions before processing
  const originalKeys = Object.keys(schema);
  const mappingEntries = Object.entries(keys);
  const collisions = [];

  mappingEntries.forEach(([sourceKey, targetKey]) => {
    // Check if target key already exists in original schema and is different from source
    if (originalKeys.includes(targetKey) && sourceKey !== targetKey) {
      collisions.push(
        `'${sourceKey}' -> '${targetKey}' (conflicts with existing '${targetKey}')`,
      );
    }
  });

  if (collisions.length > 0) {
    throw new Error(
      `Field mapping would cause key collisions: ${collisions.join(
        ', ',
      )}. Cannot map to field names that already exist in the schema.`,
    );
  }
}

/**
 * Applies field key mapping to a schema object
 * @param {Object} schema - The original schema object
 * @param {Object} keys - Mapping of standard keys to custom keys
 * @returns {Object} - Mapped schema object with transformed keys
 *
 * @throws {Error} If key mapping would cause field collisions (e.g., mapping 'street' to 'addressLine1'
 * when 'addressLine1' already exists in the original schema)
 *
 * @example
 * const originalSchema = { street: {}, postalCode: {} };
 * const mapped = applyKeyMapping(
 *   originalSchema,
 *   { street: 'addressLine1', postalCode: 'zipCode' }
 * );
 * // Returns: { addressLine1: {}, zipCode: {} }
 */
export function applyKeyMapping(schema, keys = {}) {
  validateKeys(Object.keys(keys), 'keys', MAPPABLE_KEYS);
  detectKeyCollisions(schema, keys);

  const mappedSchema = {};
  Object.entries(schema).forEach(([standardKey, fieldConfig]) => {
    const mappedKey = keys[standardKey] || standardKey;
    mappedSchema[mappedKey] = fieldConfig;
  });

  return mappedSchema;
}

export function extendFieldProperties(properties, extend = {}) {
  validateKeys(Object.keys(extend), 'extend', MAPPABLE_KEYS);

  const extendedProperties = {};
  Object.entries(properties).forEach(([key, fieldConfig]) => {
    const extensions = extend[key] || {};
    extendedProperties[key] = {
      ...fieldConfig,
      ...extensions,
    };
  });

  return extendedProperties;
}

/**
 * Update form data to remove selected military city & state and restore any
 * previously set city & state when the "I live on a U.S. military base"
 * checkbox is unchecked. See va.gov-team/issues/42216 for details
 * @param {object} oldFormData - Form data prior to interaction change
 * @param {object} formData - Form data after interaction change
 * @param {array} path - path to address in form data
 * @param {number} index - index, if form data array of addresses; also included
 *  in the path, but added here to make it easier to distinguish between
 *  addresses not in an array with addresses inside an array
 * @param {object} keys - Mapping of standard keys to custom keys
 * @returns {object} - updated Form data with manipulated mailing address if the
 * military base checkbox state changes
 */
export const updateFormDataAddress = (
  oldFormData,
  formData,
  path,
  index = null, // this is included in the path, but added as
  keys = {},
) => {
  let updatedData = formData;
  const schemaKeys = { ...DEFAULT_KEYS, ...keys };

  /*
   * formData and oldFormData are not guaranteed to have the same shape; formData
   * will always return the entire data object. See below for details on oldFormData
   *
   * In the src/platform/forms-system/src/js/containers/FormPage.jsx, if the
   * address is inside an array (has a `showPagePerItem` index), oldData is set
   * to the form data from the array index (see the this.formData() function)
   * but that may not include the address object, so we're passing in a path as
   * an array and using `getOldFormDataPath` to find the appropriate path
   */
  const oldAddress = get(getOldFormDataPath(path, index), oldFormData, {});

  const address = get(path, formData, {});
  const onMilitaryBase = address?.[schemaKeys.isMilitary];
  let city = address[schemaKeys.city];
  let stateCode = address[schemaKeys.state];

  if (oldAddress?.[schemaKeys.isMilitary] !== onMilitaryBase) {
    if (onMilitaryBase) {
      savedAddress.city = oldAddress[schemaKeys.city] || '';
      savedAddress.stateCode = oldAddress[schemaKeys.state] || '';
      city = '';
      stateCode = '';
    } else {
      city = MILITARY_CITY_VALUES.includes(oldAddress[schemaKeys.city])
        ? savedAddress.city
        : city || savedAddress.city;
      stateCode = MILITARY_STATE_VALUES.includes(oldAddress[schemaKeys.state])
        ? savedAddress.stateCode
        : stateCode || savedAddress.stateCode;
    }
    // make sure we aren't splitting up a string path
    const pathArray = Array.isArray(path) ? path : [path];
    updatedData = set([...pathArray, schemaKeys.city], city, updatedData);
    updatedData = set([...pathArray, schemaKeys.state], stateCode, updatedData);
  }
  return updatedData;
};

/**
 * @typedef {'country' | 'city' | 'isMilitary' | 'postalCode' | 'state' | 'street' | 'street2' | 'street3' } AddressSchemaKey
 */

/**
 * uiSchema for address - includes checkbox for military base, and fields for country, street, street2, street3, city, state, postal code. Fields may be omitted or mapped to alternative key names.
 *
 * ```js
 * schema: {
 *   address: addressUI()
 *   simpleAddress: addressUI({ omit: ['street2', 'street3'] })
 *   mappedAddress: addressUI({
 *     keys: { street: 'addressLine1', postalCode: 'zipCode' }
 *   })
 *   futureAddress: addressUI({
 *     labels: {
 *      militaryCheckbox: 'I will live on a United States military base outside of the U.S.'
 *      street3: 'Apt or Unit number',
 *     }
 *   })
 *   changeRequired: addressUI({
 *     required: {
 *       country: (formData) => false,
 *       street2: (formData) => true
 *     }
 *   })
 *   remappedAddress: addressUI({
 *     keys: {
 *      street: 'addressLine1',
 *      street2: 'addressLine2',
 *     }
 *   })
 * }
 * ```
 * @param {Object} [options]
 * @param {Object} [options.keys] To remap the default keys to your own schema's keys
 * @param {string} [options.keys.isMilitary]
 * @param {string} [options.keys.country]
 * @param {string} [options.keys.street]
 * @param {string} [options.keys.street2]
 * @param {string} [options.keys.street3]
 * @param {string} [options.keys.city]
 * @param {string} [options.keys.state]
 * @param {string} [options.keys.postalCode]
 * @param {Object} [options.labels] To customize field labels
 * @param {string} [options.labels.militaryCheckbox]
 * @param {string} [options.labels.country]
 * @param {string} [options.labels.street]
 * @param {string} [options.labels.street2]
 * @param {string} [options.labels.street2Military]
 * @param {string} [options.labels.street3]
 * @param {string} [options.labels.street3Military]
 * @param {string} [options.labels.city]
 * @param {string} [options.labels.state]
 * @param {string} [options.labels.postalCode]
 * @param {Array<AddressSchemaKey>} [options.omit] - If not omitting country but omitting street, city, or postalCode
 * you will need to include in your `submitTransformer` the `allowPartialAddress` option
 * @param {boolean | Record<AddressSchemaKey, (formData:any) => boolean>} [options.required]
 * @returns {UISchemaOptions}
 */
export function addressUI(options = {}) {
  const keys = { ...DEFAULT_KEYS, ...options.keys };

  let cityMaxLength = 100;
  let stateMaxLength = 100;

  const omit = key => options.omit?.includes(key);
  let customRequired = key => options.required?.[key];
  if (options?.required === false) {
    customRequired = () => () => false;
  }

  if (options?.omit) {
    validateKeys(options.omit, 'omit', MAPPABLE_KEYS);
  }

  if (options?.labels) {
    validateKeys(Object.keys(options.labels), 'labels', MAPPABLE_LABELS);
  }

  if (options?.keys) {
    validateKeys(Object.keys(options.keys), 'keys', MAPPABLE_KEYS);
    detectKeyCollisions(DEFAULT_KEYS, options.keys);
  }

  /** @type {UISchemaOptions} */
  const uiSchema = {
    'ui:validations': [],
    'ui:options': {
      classNames:
        'vads-web-component-pattern vads-web-component-pattern-address',
    },
  };

  function validateMilitaryBaseZipCode(errors, addr, mappedKeys = {}) {
    const militaryKey = mappedKeys.isMilitary;
    const stateKey = mappedKeys.state;

    if (!(addr[militaryKey] && addr[stateKey])) return;

    if (addr[militaryKey] && MILITARY_STATE_VALUES.includes(addr[stateKey])) {
      const postalCode = getFieldValue('postalCode', addr, mappedKeys);
      const postalCodeKey = mappedKeys.postalCode;

      const state = getFieldValue('state', addr, mappedKeys);

      const isAA = state === 'AA' && /^340\d*/.test(postalCode);
      const isAE = state === 'AE' && /^09[0-9]\d*/.test(postalCode);
      const isAP = state === 'AP' && /^96[2-6]\d*/.test(postalCode);
      if (!(isAA || isAE || isAP)) {
        const militaryTitle =
          options.labels?.militaryCheckbox ??
          'I live on a U.S. military base outside of the United States.';
        errors[postalCodeKey].addError(
          `This postal code is within the United States. If your mailing address is in the United States, uncheck the checkbox "${militaryTitle}". If your mailing address is an APO/FPO/DPO address, enter the postal code for the military base.`,
        );
      }
    }
  }

  function requiredFunc(key, def) {
    return (formData, index, fullData, path) => {
      if (customRequired(key)) {
        return customRequired(key)(formData, index, fullData, path);
      }

      return def;
    };
  }

  if (!omit('isMilitary')) {
    uiSchema[keys.isMilitary] = {
      'ui:required': requiredFunc('isMilitary', false),
      'ui:title':
        options.labels?.militaryCheckbox ??
        'I live on a U.S. military base outside of the United States.',
      'ui:webComponentField': VaCheckboxField,
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        hideEmptyValueInReview: true,
      },
    };

    uiSchema['ui:validations'].push((errors, addr) =>
      validateMilitaryBaseZipCode(errors, addr, keys),
    );
  }

  if (!omit('isMilitary') && !omit('view:militaryBaseDescription')) {
    uiSchema[keys['view:militaryBaseDescription']] = {
      'ui:description': MilitaryBaseInfo,
    };
  }

  if (!omit('country')) {
    uiSchema[keys.country] = {
      'ui:required': (formData, index, fullData, path) => {
        if (customRequired('country')) {
          return customRequired('country')(formData, index, fullData, path);
        }
        const addressPath = getAddressPath(path);
        if (addressPath) {
          const addressData = get(addressPath, formData) ?? {};
          const militaryKey = keys.isMilitary;
          return !addressData[militaryKey];
        }
        return true;
      },
      'ui:title': options.labels?.country || 'Country',
      'ui:autocomplete': 'country',
      'ui:webComponentField': VaSelectField,
      'ui:errorMessages': {
        required: 'Select a country',
      },
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        /**
         * This is needed because the country dropdown needs to be set to USA and disabled if a
         * user selects that they live on a military base outside the US.
         */
        updateSchema: (formData, schema, _uiSchema, index, path) => {
          const addressPath = getAddressPath(path); // path is ['address', 'currentField']
          const countryUI = _uiSchema;
          const addressFormData = get(addressPath, formData) ?? {};
          /* Set isMilitary to either `true` or `undefined` (not `false`) so that
          `hideEmptyValueInReview` works as expected. See docs: https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-about-schema-and-uischema#VAFormsLibrary-AboutschemaanduiSchema-ui:options */
          const militaryKey = keys.isMilitary;
          const countryKey = keys.country;
          addressFormData[militaryKey] =
            addressFormData[militaryKey] || undefined;
          const isMilitary = addressFormData[militaryKey];
          // 'inert' is the preferred solution for now
          // instead of disabled via DST guidance
          if (isMilitary) {
            countryUI['ui:options'].inert = true;
            addressFormData[countryKey] = USA.value;
            return {
              enum: [USA.value],
              enumNames: [USA.label],
              default: USA.value,
            };
          }
          countryUI['ui:options'].inert = false;
          return {
            type: 'string',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          };
        },
      },
    };
  }

  if (!omit('street')) {
    uiSchema[keys.street] = {
      'ui:required': requiredFunc('street', true),
      'ui:title': options.labels?.street || 'Street address',
      'ui:autocomplete': 'address-line1',
      'ui:errorMessages': {
        required: 'Enter a street address',
        pattern: 'Enter a valid street address',
      },
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        replaceSchema: (_, schema) => {
          return {
            ...schema,
            pattern: NONBLANK_PATTERN,
          };
        },
      },
    };
  }

  if (!omit('street2')) {
    uiSchema[keys.street2] = {
      'ui:autocomplete': 'address-line2',
      'ui:required': requiredFunc('street2', false),
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        hideEmptyValueInReview: true,
        updateSchema: (formData, schema, _uiSchema, index, path) => {
          const addressPath = getAddressPath(path);
          const addressFormData = get(addressPath, formData) ?? {};
          const militaryKey = keys.isMilitary;
          const isMilitary = addressFormData[militaryKey];

          const titleIfMilitary =
            options.labels?.street2Military || 'Apartment or unit number';
          const titleIfNotMilitary =
            options.labels?.street2 || 'Street address line 2';

          return {
            ...schema,
            title: isMilitary ? titleIfMilitary : titleIfNotMilitary,
          };
        },
      },
    };
  }

  if (!omit('street3')) {
    uiSchema[keys.street3] = {
      'ui:autocomplete': 'address-line3',
      'ui:required': requiredFunc('street3', false),
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        hideEmptyValueInReview: true,
        updateSchema: (formData, schema, _uiSchema, _index, path) => {
          const addressPath = getAddressPath(path);
          const addressFormData = get(addressPath, formData) ?? {};
          const militaryKey = keys.isMilitary;
          const isMilitary = addressFormData[militaryKey];

          const titleIfMilitary =
            options.labels?.street3Military || 'Additional address information';
          const titleIfNotMilitary =
            options.labels?.street3 || 'Street address line 3';

          return {
            ...schema,
            title: isMilitary ? titleIfMilitary : titleIfNotMilitary,
          };
        },
      },
      'ui:webComponentField': VaTextInputField,
    };
  }

  if (!omit('city')) {
    uiSchema[keys.city] = {
      'ui:required': requiredFunc('city', true),
      'ui:autocomplete': 'address-level2',
      'ui:errorMessages': CITY_ERROR_MESSAGES_DEFAULT,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        /**
         * replaceSchema:
         * Necessary because military addresses require strict options.
         * If the isMilitary checkbox is selected, replace the city schema with a
         * select dropdown containing the values for military cities. Otherwise,
         * just return the regular string schema.
         */
        replaceSchema: (formData, schema, _uiSchema, index, path) => {
          if (schema.maxLength) {
            cityMaxLength = schema.maxLength;
          }
          const addressPath = getAddressPath(path); // path is ['address', 'currentField']
          const ui = _uiSchema;
          const addressFormData = get(addressPath, formData) ?? {};
          const militaryKey = keys.isMilitary;
          const isMilitary = addressFormData[militaryKey];
          if (isMilitary) {
            ui['ui:webComponentField'] = VaRadioField;
            ui['ui:errorMessages'] = CITY_ERROR_MESSAGES_MILITARY;
            return {
              type: 'string',
              title: MILITARY_CITY_TITLE,
              enum: MILITARY_CITY_VALUES,
              enumNames: MILITARY_CITY_NAMES,
            };
          }

          ui['ui:webComponentField'] = VaTextInputField;
          ui['ui:errorMessages'] = CITY_ERROR_MESSAGES_DEFAULT;
          return {
            type: 'string',
            title: 'City',
            maxLength: cityMaxLength,
            pattern: NONBLANK_PATTERN,
          };
        },
      },
    };
  }

  if (!omit('state')) {
    uiSchema[keys.state] = {
      'ui:autocomplete': 'address-level1',
      'ui:required': (formData, index, fullData, path) => {
        if (customRequired('state')) {
          return customRequired('state')(formData, index, fullData, path);
        }

        const addressPath = getAddressPath(path);
        if (addressPath) {
          const countryKey = keys.country;
          const country = get(addressPath, formData)?.[countryKey] ?? '';
          const militaryKey = keys.isMilitary;
          const isMilitary = get(addressPath, formData)?.[militaryKey];
          return (
            isMilitary || (country && ['USA', 'CAN', 'MEX'].includes(country))
          );
        }

        return false;
      },
      'ui:errorMessages': STATE_ERROR_MESSAGES_DEFAULT,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        hideEmptyValueInReview: true,
        /**
         * replaceSchema:
         * Necessary because military addresses require strict options.
         * If the isMilitary checkbox is selected, replace the state schema with a
         * select dropdown containing the values for military states.
         *
         * If the country value is USA and the military base checkbox is de-selected,
         * use the States dropdown.
         *
         * If the country value is Canada and the military base checkbox is de-selected,
         * use the Canadian "States" dropdown.
         *
         * If the country value is Mexico and the military base checkbox is de-selected,
         * use the Mexican "States" dropdown.
         *
         * If the country value is anything other than USA, Canada, or Mexico, change the title and default to string.
         */
        replaceSchema: (formData, schema, _uiSchema, index, path) => {
          if (schema.maxLength) {
            stateMaxLength = schema.maxLength;
          }

          const addressPath = getAddressPath(path); // path is ['address', 'currentField']
          const data = get(addressPath, formData) ?? {};
          const countryKey = keys.country;
          const country = data[countryKey];
          const militaryKey = keys.isMilitary;
          const isMilitary = data[militaryKey];
          const ui = _uiSchema;

          if (isMilitary) {
            ui['ui:webComponentField'] = VaRadioField;
            ui['ui:errorMessages'] = STATE_ERROR_MESSAGES_MILITARY;
            return {
              type: 'string',
              title: STATE_LABEL_MILITARY,
              enum: MILITARY_STATE_VALUES,
              enumNames: MILITARY_STATE_NAMES,
            };
          }
          if (!isMilitary && country === 'USA') {
            ui['ui:webComponentField'] = VaSelectField;
            ui['ui:errorMessages'] = STATE_ERROR_MESSAGES_USA;
            return {
              type: 'string',
              title: STATE_LABEL_USA,
              enum: STATE_VALUES,
              enumNames: STATE_NAMES,
            };
          }
          if (!isMilitary && country === 'CAN') {
            ui['ui:webComponentField'] = VaSelectField;
            ui['ui:errorMessages'] = STATE_ERROR_MESSAGES_CAN;
            return {
              type: 'string',
              title: STATE_LABEL_CAN,
              enum: CAN_STATE_VALUES,
              enumNames: CAN_STATE_NAMES,
            };
          }
          if (!isMilitary && country === 'MEX') {
            ui['ui:webComponentField'] = VaSelectField;
            ui['ui:errorMessages'] = STATE_ERROR_MESSAGES_MEX;
            return {
              type: 'string',
              title: STATE_LABEL_MEX,
              enum: MEX_STATE_VALUES,
              enumNames: MEX_STATE_NAMES,
            };
          }
          ui['ui:webComponentField'] = VaTextInputField;
          ui['ui:errorMessages'] = STATE_ERROR_MESSAGES_DEFAULT;
          return {
            type: 'string',
            title: STATE_LABEL_DEFAULT,
            maxLength: stateMaxLength,
            pattern: STATE_PROVINCE_PATTERN,
          };
        },
      },
    };
  }

  if (!omit('postalCode')) {
    uiSchema[keys.postalCode] = {
      'ui:required': requiredFunc('postalCode', true),
      'ui:title': options.labels?.postalCode ?? 'Postal code',
      'ui:autocomplete': 'postal-code',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        widgetClassNames: 'usa-input-medium',
        replaceSchema: (formData, _schema, _uiSchema, index, path) => {
          const addressPath = getAddressPath(path); // path is ['address', 'currentField']
          const data = get(addressPath, formData) ?? {};
          const countryKey = keys.country;
          const country = data[countryKey];
          const militaryKey = keys.isMilitary;
          const isMilitary = data[militaryKey];

          const addressSchema = _schema;
          const addressUiSchema = _uiSchema;

          // country-specific error messages
          if (country === 'USA') {
            addressUiSchema['ui:errorMessages'] =
              POSTAL_CODE_PATTERN_ERROR_MESSAGES.USA;
          } else if (['CAN', 'MEX'].includes(country)) {
            addressUiSchema['ui:errorMessages'] =
              POSTAL_CODE_PATTERN_ERROR_MESSAGES[country];
          } else if (!country) {
            addressUiSchema['ui:errorMessages'] =
              POSTAL_CODE_PATTERN_ERROR_MESSAGES.NONE;
          } else {
            addressUiSchema['ui:errorMessages'] =
              POSTAL_CODE_PATTERN_ERROR_MESSAGES.OTHER;
          }

          addressSchema.type = 'string';
          // country-specific patterns
          if (isMilitary) {
            addressSchema.pattern = POSTAL_CODE_PATTERNS.USA;
          } else if (['CAN', 'MEX', 'USA'].includes(country)) {
            addressSchema.pattern = POSTAL_CODE_PATTERNS[country];
          } else {
            addressSchema.pattern = NONBLANK_PATTERN;
          }

          return {
            ...addressSchema,
          };
        },
      },
    };
  }
  return uiSchema;
}

/**
 * Schema for addressUI. Fields may be omitted, remapped, or extended.
 *
 * ```js
 * schema: {
 *   address: addressSchema()
 *   simpleAddress: addressSchema({ omit: ['street2', 'street3'] })
 *   mappedAddress: addressSchema({
 *     keys: { street: 'addressLine1', postalCode: 'zipCode' }
 *   })
 *   pdfAddress: addressSchema({
 *     omit: ['street3'],
 *     extend: {
 *       street: { maxLength: 30 },
 *       city: { maxLength: 18 }
 *     }
 *   })
 * }
 * ```
 * @param {Object} [options]
 * @param {Array<AddressSchemaKey>} [options.omit] - Field names to omit from schema
 * @param {Record<AddressSchemaKey, string>} [options.keys] - Maps standard keys to custom keys (e.g., {street: 'addressLine1', postalCode: 'zipCode'}). Uses applyKeyMapping utility internally.
 * @param {Record<string, object>} [options.extend] - Additional schema properties to extend default schema fields (e.g., {street: {maxLength: 30}, city: {maxLength: 18}})
 * @returns {SchemaOptions}
 */
export const addressSchema = (options = {}) => {
  const { keys = {}, omit = [], extend = {} } = options;
  const schema = commonDefinitions.profileAddress;

  // Only modify properties if needed
  const needsOmit = omit.length > 0;
  const needsKeyMapping = Object.keys(keys).length > 0;
  const needsExtend = Object.keys(extend).length > 0;

  if (!needsOmit && !needsKeyMapping && !needsExtend) {
    return schema;
  }

  let { properties } = schema;

  if (needsOmit) {
    validateKeys(omit, 'omit', MAPPABLE_KEYS);
    properties = utilsOmit(omit, properties);
  }

  if (needsExtend) {
    properties = extendFieldProperties(properties, extend);
  }

  if (needsKeyMapping) {
    properties = applyKeyMapping(properties, keys);
  }

  return {
    ...schema,
    properties,
  };
};

/**
 *  uiSchema for address - Same as addressUI, but without the military checkbox. Includes fields for country, street, street2, street3, city, state, postal code. Fields may be omitted.
 *
 * ```js
 * schema: {
 *   address: addressNoMilitaryUI()
 *   simpleAddress: addressNoMilitaryUI({ omit: ['street2', 'street3'] })
 *   futureAddress: addressNoMilitaryUI({
 *     labels: {
 *      street3: 'Apt or Unit number',
 *     }
 *   })
 *   changeRequired: addressNoMilitaryUI({
 *     required: {
 *       country: (formData) => false,
 *       street2: (formData) => true
 *     }
 *   })
 * }
 * ```
 * @param {Object} [options]
 * @param {Object} [options.labels]
 * @param {string} [options.labels.street]
 * @param {string} [options.labels.street2]
 * @param {string} [options.labels.street3]
 * @param {Array<AddressSchemaKey>} [options.omit] - If not omitting country but omitting street, city, or postalCode
 * you will need to include in your `submitTransformer` the `allowPartialAddress` option
 * @param {boolean | Record<AddressSchemaKey, (formData:any) => boolean>} [options.required]
 * @returns {UISchemaOptions}
 */
export const addressNoMilitaryUI = options =>
  addressUI({
    ...options,
    omit: ['isMilitary', ...(options?.omit || [])],
  });

/**
 * Schema for addressNoMilitaryUI. Fields may be omitted, remapped, or extended.
 *
 * ```js
 * schema: {
 *   address: addressNoMilitarySchema()
 *   simpleAddress: addressNoMilitarySchema({ omit: ['street2', 'street3'] })
 *   mappedAddress: addressNoMilitarySchema({
 *    keys: { street: 'addressLine1', postalCode: 'zipCode' }
 *   })
 *   pdfAddress: addressNoMilitarySchema({
 *    omit: ['street3'],
 *    extend: {
 *      street: { maxLength: 30 },
 *     city: { maxLength: 18 }
 *   }
 *   })
 * }
 * ```
 *
 * @param {{
 *  omit: string[],
 *  keys: Record<string, string>,
 *  extend: Record<string, object>
 * }} [options]
 * @returns {SchemaOptions}
 */
export const addressNoMilitarySchema = options =>
  addressSchema({
    ...options,
    omit: ['isMilitary', ...(options?.omit || [])],
  });
