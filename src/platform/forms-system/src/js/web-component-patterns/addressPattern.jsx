/**
 * Web component version of address
 */
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
 * POSTAL_CODE_PATTERNS - Matches US/Mexican/Canadian codes
 */
const NONBLANK_PATTERN = '^.*\\S.*';
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

const schemaCrossXRef = {
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
 * @returns {object} - updated Form data with manipulated mailing address if the
 * military base checkbox state changes
 */
export const updateFormDataAddress = (
  oldFormData,
  formData,
  path,
  index = null, // this is included in the path, but added as
  keyMap = {},
) => {
  let updatedData = formData;
  const schemaKeys = { ...schemaCrossXRef, ...keyMap };

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
 * uiSchema for address - includes checkbox for military base, and fields for country, street, street2, street3, city, state, postal code. Fields may be omitted.
 *
 * ```js
 * schema: {
 *   address: addressUI()
 *   simpleAddress: addressUI({ omit: ['street2', 'street3'] })
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
 * }
 * ```
 * @param {Object} [options]
 * @param {Object} [options.keyMap] - Maps standard keys to custom keys (e.g., {street: 'addressLine1', postalCode: 'zipCode'})
 * @param {Object} [options.labels]
 * @param {string} [options.labels.militaryCheckbox]
 * @param {string} [options.labels.street]
 * @param {string} [options.labels.street2]
 * @param {string} [options.labels.street2Military]
 * @param {string} [options.labels.street3]
 * @param {string} [options.labels.street3Military]
 * @param {Array<AddressSchemaKey>} [options.omit] - If not omitting country but omitting street, city, or postalCode
 * you will need to include in your `submitTransformer` the `allowPartialAddress` option
 * @param {boolean | Record<AddressSchemaKey, (formData:any) => boolean>} [options.required]
 * @returns {UISchemaOptions}
 */
export function addressUI(options = {}) {
  const { keyMap = {} } = options;
  let cityMaxLength = 100;
  let stateMaxLength = 100;

  const omit = key => options.omit?.includes(key);
  let customRequired = key => options.required?.[key];
  if (options.required === false) {
    customRequired = () => () => false;
  }

  /** @type {UISchemaOptions} */
  const uiSchema = {
    'ui:validations': [],
    'ui:options': {
      classNames:
        'vads-web-component-pattern vads-web-component-pattern-address',
    },
  };

  function validateMilitaryBaseZipCode(errors, addr) {
    if (!(addr.isMilitary && addr.state)) return;

    if (addr.isMilitary && MILITARY_STATE_VALUES.includes(addr.state)) {
      const isAA = addr.state === 'AA' && /^340\d*/.test(addr.postalCode);
      const isAE = addr.state === 'AE' && /^09[0-9]\d*/.test(addr.postalCode);
      const isAP = addr.state === 'AP' && /^96[2-6]\d*/.test(addr.postalCode);
      if (!(isAA || isAE || isAP)) {
        errors.postalCode.addError(
          `This postal code is within the United States. If your mailing address is in the United States, uncheck the checkbox "${
            uiSchema.isMilitary['ui:title']
          }". If your mailing address is an APO/FPO/DPO address, enter the postal code for the military base.`,
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
    uiSchema.isMilitary = {
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

    uiSchema['ui:validations'].push(validateMilitaryBaseZipCode);
  }

  if (!omit('isMilitary') && !omit('view:militaryBaseDescription')) {
    uiSchema['view:militaryBaseDescription'] = {
      'ui:description': MilitaryBaseInfo,
    };
  }

  if (!omit('country')) {
    uiSchema.country = {
      'ui:required': (formData, index, fullData, path) => {
        if (customRequired('country')) {
          return customRequired('country')(formData, index, fullData, path);
        }
        const addressPath = getAddressPath(path);
        if (addressPath) {
          const { isMilitary } = get(addressPath, formData) ?? {};
          return !isMilitary;
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
          addressFormData.isMilitary = addressFormData.isMilitary || undefined;
          const { isMilitary } = addressFormData;
          // 'inert' is the preferred solution for now
          // instead of disabled via DST guidance
          if (isMilitary) {
            countryUI['ui:options'].inert = true;
            addressFormData.country = USA.value;
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
    uiSchema.street = {
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
    uiSchema.street2 = {
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
          const { isMilitary } = addressFormData;

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
    uiSchema.street3 = {
      'ui:autocomplete': 'address-line3',
      'ui:required': requiredFunc('street3', false),
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        hideEmptyValueInReview: true,
        updateSchema: (formData, schema, _uiSchema, _index, path) => {
          const addressPath = getAddressPath(path);
          const addressFormData = get(addressPath, formData) ?? {};
          const { isMilitary } = addressFormData;

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
    uiSchema.city = {
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
          const { isMilitary } = addressFormData;
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
    uiSchema.state = {
      'ui:autocomplete': 'address-level1',
      'ui:required': (formData, index, fullData, path) => {
        if (customRequired('state')) {
          return customRequired('state')(formData, index, fullData, path);
        }

        const addressPath = getAddressPath(path);
        if (addressPath) {
          const { country, isMilitary } = get(addressPath, formData) ?? {};
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
          const { country } = data;
          const { isMilitary } = data;
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
          };
        },
      },
    };
  }

  if (!omit('postalCode')) {
    uiSchema.postalCode = {
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
          const { country } = data;
          const { isMilitary } = data;
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
            // no pattern validation for other countries
            addressSchema.pattern = undefined;
          }

          return {
            ...addressSchema,
          };
        },
      },
    };
  }
  // If no keyMap, return as-is (backward compatibility)
  if (Object.keys(keyMap).length === 0) {
    return uiSchema;
  }
  // Apply key mapping
  const mappedSchema = {};
  Object.entries(uiSchema).forEach(([standardKey, fieldConfig]) => {
    const mappedKey = keyMap[standardKey] || standardKey;
    if (!omit(standardKey) && !omit(mappedKey)) {
      mappedSchema[mappedKey] = fieldConfig;
    } else {
      mappedSchema[standardKey] = fieldConfig;
    }
  });
  return mappedSchema;
}

/**
 * Schema for addressUI. Fields may be omitted.
 *
 * ```js
 * schema: {
 *   address: addressSchema()
 *   simpleAddress: addressSchema({ omit: ['street2', 'street3'] })
 * }
 * ```
 * @param {{
 *  omit: string[]
 * }} [options]
 * @param {Object} [options.keyMap] - Maps standard keys to custom keys (e.g., {street: 'addressLine1', postalCode: 'zipCode'})
 * @returns {SchemaOptions}
 */
export const addressSchema = options => {
  const { keyMap = {}, omit = [] } = options;
  let schema = commonDefinitions.profileAddress;

  if (options?.omit) {
    schema = {
      ...schema,
      properties: {
        ...utilsOmit(options.omit, schema.properties),
      },
    };
  }

  // If no keyMap provided, return standard schema
  if (Object.keys(keyMap).length === 0) {
    return schema;
  }

  // Apply key mapping and omit filtering to properties
  const mappedProperties = {};

  Object.entries(schema.properties).forEach(([standardKey, propertyConfig]) => {
    // Skip if field should be omitted
    const mappedKey = keyMap[standardKey] || standardKey;
    if (omit.includes(standardKey) || omit.includes(mappedKey)) {
      return;
    }

    // Use mapped key name, preserve property configuration
    mappedProperties[mappedKey] = propertyConfig;
  });

  return {
    ...schema,
    properties: mappedProperties,
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
 * Schema for addressNoMilitaryUI. Fields may be omitted.
 *
 * ```js
 * schema: {
 *   address: addressNoMilitarySchema()
 *   simpleAddress: addressNoMilitarySchema({ omit: ['street2', 'street3'] })
 * }
 * ```
 */
export const addressNoMilitarySchema = options =>
  addressSchema({
    ...options,
    omit: ['isMilitary', ...(options?.omit || [])],
  });
