import { camelCase } from 'lodash';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * @typedef {Object} NormalizedResponseOption
 * @property {string} [description]
 * @property {string} label
 */

/**
 * @typedef {Object} RadioButtonComponent
 * @property {string} [hint]
 * @property {string} label
 * @property {Array<NormalizedResponseOption>} responseOptions
 */

/**
 *
 * @param {Array<NormalizedResponseOption} responseOptions
 * @returns {[Array<string>, Record<string, string>, Record<string, string>]}
 */
const formatResponseOptions = responseOptions => {
  /** @type {Array<string>} */
  const keys = [];

  /** @type {Record<string, string>} */
  const labels = {};

  /** @type {Record<string, string>} */
  const descriptions = {};

  responseOptions.forEach(option => {
    const key = camelCase(option.label);

    keys.push(key);
    labels[key] = option.label;
    descriptions[key] = option.description;
  });

  return [keys, labels, descriptions];
};

/**
 *
 * @param {RadioButtonComponent} component
 * @returns {[SchemaOptions, UISchemaOptions]}
 */
export default ({ hint, label, responseOptions }) => {
  const [keys, labels, descriptions] = formatResponseOptions(responseOptions);

  return [
    radioSchema(keys),
    radioUI({ title: label, hint, labels, descriptions }),
  ];
};
