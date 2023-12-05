import get from 'platform/utilities/data/get';
import ArnField from '../web-component-fields/ArnField';
import { vaFileNumberUI, vaFileNumberSchema } from './ssnPattern';
import { validateARN } from '../validation';
import ARNReviewWidget from '../review/ARNWidget';

const ARN_DEFAULT_TITLE = 'Alien registration number';

/**
 * Web component for Alien registration number (ARN)
 *
 * Pattern recommendation: Use the applicable person in the title
 * rather than in the field names.
 *
 * ```js
 * example: arnUI() // Alien registration number
 * example: arnUI("Veteran's Alien registration number")
 * ```
 * @param {string} [title]
 * @returns {UISchemaOptions}
 */
const arnUI = title => {
  return {
    'ui:title': title ?? ARN_DEFAULT_TITLE,
    'ui:webComponentField': ArnField,
    'ui:reviewWidget': ARNReviewWidget,
    'ui:validations': [validateARN],
    'ui:errorMessages': {
      pattern:
        'Please enter a valid 7-9 digit Alien registration number (dashes allowed)',
      required: 'Please enter an Alien registration number',
    },
  };
};

/**
 * Schema for Alien registration number
 *
 * ```js
 * // uiSchema
 * example: arnUI()
 * // schema
 * example: arnSchema
 * ```
 * @returns `commonDefinitions.arn`
 */
const arnSchema = {
  type: 'string',
  pattern: '^[0-9]{7,9}$',
};

/**
 * Web components for Alien registration number or VA File Number
 *
 * Pattern recommendation: Use the applicable person in the title
 * rather than in the field names.
 *
 * A grouped object containing `arn` and `vaFileNumber` properties
 * ```js
 * example: arnOrVaFileNumberUI()
 * ```
 * @returns {UISchemaOptions}
 */
const arnOrVaFileNumberUI = () => {
  return {
    arn: arnUI(),
    vaFileNumber: {
      ...vaFileNumberUI(),
    },
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
 * ```js
 * // uiSchema
 * example: arnOrVaFileNumberUI()
 * // schema
 * example: arnOrVaFileNumberSchema
 * ```
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
