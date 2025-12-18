import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import get from 'platform/utilities/data/get';
import SsnField, { maskSSN } from '../web-component-fields/SsnField';
import { validateSSN } from '../validation';
import SSNReviewWidget from '../review/SSNWidget';
import VAFileNumberWidget from '../review/VAFileNumberWidget';
import ServiceNumberWidget from '../review/ServiceNumberWidget';
import VaTextInputField from '../web-component-fields/VaTextInputField';

const SSN_DEFAULT_TITLE = 'Social Security number';
const VA_FILE_NUMBER_DEFAULT_TITLE = 'VA file number';
const SERVICE_NUMBER_DEFAULT_TITLE = 'Military Service number';

/**
 * uiSchema for Social Security number field
 *
 * Pattern recommendation: Use the applicable person in the title
 * rather than in the field names.
 *
 * ```js
 * example: ssnUI() // Social Security number
 * example: ssnUI("Veteran's Social Security number")
 * ```
 * @param {string} [title]
 * @returns {UISchemaOptions}
 */
const ssnUI = title => {
  return {
    'ui:title': title ?? SSN_DEFAULT_TITLE,
    'ui:webComponentField': SsnField,
    'ui:reviewWidget': SSNReviewWidget,
    'ui:confirmationField': ({ formData }) => ({ data: maskSSN(formData) }),
    'ui:validations': [validateSSN],
    'ui:errorMessages': {
      pattern: 'Enter a valid 9-digit Social Security number (dashes allowed)',
      required: 'Enter a valid 9-digit Social Security number (dashes allowed)',
    },
  };
};

/**
 * Schema for ssnUI
 *
 * ```js
 * // uiSchema
 * example: ssnUI()
 * // schema
 * example: ssnSchema
 * ```
 * @returns `commonDefinitions.ssn`
 */
const ssnSchema = commonDefinitions.ssn;

/**
 * uiSchema for VA File Number
 *
 * Pattern recommendation: Use the applicable person in the title
 * rather than in the field names.
 *
 * ```js
 * example: vaFileNumberUI() // VA file number
 * example: vaFileNumberUI("Veteran's VA file number")
 * ```
 * @param {string} [title]
 * @returns {UISchemaOptions}
 */
const vaFileNumberUI = title => {
  return {
    'ui:title': title ?? VA_FILE_NUMBER_DEFAULT_TITLE,
    'ui:webComponentField': VaTextInputField,
    'ui:reviewWidget': VAFileNumberWidget,
    'ui:errorMessages': {
      pattern: 'Your VA file number must be 8 or 9 digits',
    },
    'ui:options': {
      hideEmptyValueInReview: true,
    },
  };
};

/**
 * Schema for vaFileNumberUI
 *
 * ```js
 * // uiSchema
 * example: vaFileNumberUI()
 * // schema
 * example: vaFileNumberSchema
 * ```
 * @returns `commonDefinitions.centralMailVaFile`
 */
const vaFileNumberSchema = commonDefinitions.centralMailVaFile;

/**
 * uiSchema for Service Number
 *
 * Pattern recommendation: Use the applicable person in the title
 * rather than in the field names.
 *
 * ```js
 * example: serviceNumberUI() // Service number
 * example: serviceNumberUI("Veteran's Service number")
 * ```
 * @param {string} [title]
 * @returns {UISchemaOptions}
 */
const serviceNumberUI = title => {
  return {
    'ui:title': title ?? SERVICE_NUMBER_DEFAULT_TITLE,
    'ui:webComponentField': VaTextInputField,
    'ui:reviewWidget': ServiceNumberWidget,
    'ui:errorMessages': {
      pattern: `Your ${title ??
        SERVICE_NUMBER_DEFAULT_TITLE} must start with 0, 1, or 2 uppercase letters followed by 5 to 8 digits`,
    },
    'ui:options': {
      hideEmptyValueInReview: true,
    },
  };
};

/**
 * Schema for serviceNumberUI
 *
 * ```js
 * // uiSchema
 * example: serviceNumberUI()
 * // schema
 * example: serviceNumberSchema
 * ```
 * @returns `commonDefinitions.veteranServiceNumber`
 */
const serviceNumberSchema = commonDefinitions.veteranServiceNumber;

/**
 * uiSchema for Social Security number or VA File Number. Includes two fields, and a hint about entering either or.
 *
 * Pattern recommendation: Use the applicable person in the title
 * rather than in the field names.
 *
 * A grouped object containing `ssn` and `vaFileNumber` properties
 * ```js
 * example: ssnOrVaFileNumberUI()
 * ```
 * @returns {UISchemaOptions}
 */
const ssnOrVaFileNumberUI = () => {
  return {
    ssn: {
      ...ssnUI(),
      'ui:options': {
        hint: 'You must enter a Social Security number or VA file number.',
      },
    },
    vaFileNumber: vaFileNumberUI(),
    'ui:options': {
      updateSchema: (formData, _schema, _uiSchema, index, path) => {
        const { ssn, vaFileNumber } = get(path, formData) ?? {};

        let required = ['ssn'];
        if (!ssn && vaFileNumber) {
          required = ['vaFileNumber'];
        }

        return {
          ..._schema,
          required,
        };
      },
    },
  };
};

/**
 * uiSchema for Social Security number or VA File Number. Should be used with a description above the fields such as: "You must enter a Social Security number or VA file number"
 *
 * Pattern recommendation: Use the applicable person in the title
 * rather than in the field names.
 *
 * A grouped object containing `ssn` and `vaFileNumber` properties
 * ```js
 * example: ssnOrVaFileNumberNoHintUI()
 * ```
 * @returns {UISchemaOptions}
 */
const ssnOrVaFileNumberNoHintUI = () => {
  return {
    ssn: ssnUI(),
    vaFileNumber: vaFileNumberUI(),
    'ui:options': {
      updateSchema: (formData, _schema, _uiSchema, index, path) => {
        const { ssn, vaFileNumber } = get(path, formData) ?? {};

        let required = ['ssn'];
        if (!ssn && vaFileNumber) {
          required = ['vaFileNumber'];
        }

        return {
          ..._schema,
          required,
        };
      },
    },
  };
};

/**
 * Schema for ssnOrVaFileNumberUI
 *
 * ```js
 * // uiSchema
 * example: ssnOrVaFileNumberUI()
 * // schema
 * example: ssnOrVaFileNumberSchema
 * ```
 */
const ssnOrVaFileNumberSchema = {
  type: 'object',
  properties: {
    ssn: ssnSchema,
    vaFileNumber: vaFileNumberSchema,
  },
  required: ['ssn'],
};

/**
 * Schema for ssnOrVaFileNumberNoHintUI
 *
 * ```js
 * // uiSchema
 * example: ssnOrVaFileNumberNoHintUI()
 * // schema
 * example: ssnOrVaFileNumberNoHintSchema
 * ```
 */
const ssnOrVaFileNumberNoHintSchema = ssnOrVaFileNumberSchema;

/**
 * Schema ssnOrServiceNumberUI
 *
 * Accepts:
 * - SSN: 123-45-6789 or 123456789
 * - Service Number: Starts with 0–2 uppercase letters followed by 5–8 digits
 *
 * ```js
 * // uiSchema: use VaTextInputField
 * // schema:
 * example: ssnOrServiceNumberSchema
 * ```
 */
const ssnOrServiceNumberSchema = {
  type: 'string',
  pattern: '^(\\d{3}-?\\d{2}-?\\d{4}|[A-Z]{1,2}\\d{5,8})$',
};

export {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  ssnOrServiceNumberSchema,
};
