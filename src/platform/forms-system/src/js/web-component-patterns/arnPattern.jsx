import get from 'platform/utilities/data/get';
import ArnField from '../web-component-fields/ArnField';
import { vaFileNumberUI, vaFileNumberSchema } from './ssnPattern';
import ARNReviewWidget from '../review/ARNWidget';

const ARN_DEFAULT_TITLE = 'Alien registration number';

/**
 * Web component v3 for Alien registration number (ARN)
 *
 * Pattern recommendation: Use the applicable person in the title
 * rather than in the field names.
 *
 * @example
 * example: arnUI() // Alien registration number
 * example: arnUI("Veteran's Alien registration number")
 * @param {string} [title="Alien registration number"] label for the field
 * @returns {UISchemaOptions}
 * @memberof module:IdentificationPatterns
 * @function
 */
const arnUI = title => {
  return {
    'ui:title': title ?? ARN_DEFAULT_TITLE,
    'ui:webComponentField': ArnField,
    'ui:reviewWidget': ARNReviewWidget,
    'ui:errorMessages': {
      pattern: 'Enter a valid 8 or 9 digit A-number (only numbers are allowed)',
      required: 'Please enter an Alien registration number',
    },
    'ui:options': {
      hint:
        'Only numbers are allowed. If your A-number is “A12345678,” enter “12345678”',
    },
  };
};

/**
 * Schema for Alien registration number
 *
 * @example
 * // uiSchema
 * example: arnUI()
 * // schema
 * example: arnSchema
 * @returns `commonDefinitions.arn`
 */
const arnSchema = {
  type: 'string',
  pattern: '^\\d{8,9}$',
};

/**
 * Web components for Alien registration number or VA File Number
 *
 * Pattern recommendation: Use the applicable person in the title
 * rather than in the field names.
 *
 * A grouped object containing `arn` and `vaFileNumber` properties
 * @example
 * example: arnOrVaFileNumberUI()
 * @returns {UISchemaOptions}
 * @memberof module:IdentificationPatterns
 * @function
 */
const arnOrVaFileNumberUI = () => {
  return {
    arn: {
      ...arnUI(),
      'ui:errorMessages': {
        ...arnUI()['ui:errorMessages'],
        required: 'Enter at least one identification number',
      },
    },
    vaFileNumber: vaFileNumberUI(),
    'ui:options': {
      updateSchema: (formData, _schema, _uiSchema, index, path) => {
        const { arn, vaFileNumber } = get(path, formData) ?? {};

        let required = ['arn'];
        if (!arn && vaFileNumber) {
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
 * Schema for ARN or VA File Number
 *
 * @example
 * // uiSchema
 * example: arnOrVaFileNumberUI()
 * // schema
 * example: arnOrVaFileNumberSchema
 * @memberof module:IdentificationPatterns
 */
const arnOrVaFileNumberSchema = {
  type: 'object',
  properties: {
    arn: arnSchema,
    vaFileNumber: vaFileNumberSchema,
  },
  required: ['arn'],
};

export { arnUI, arnSchema, arnOrVaFileNumberUI, arnOrVaFileNumberSchema };
