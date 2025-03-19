import { camelCase } from 'lodash';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 *
 * @param {Array<NormalizedResponseOption} responseOptions
 * @returns {[Array<string>, Record<string, UISchemaOptions>]}
 */
export const formatResponseOptions = responseOptions => {
  /** @type {Array<string>} */
  const keys = [];

  /** @type {Record<string, string>} */
  const labels = {};

  responseOptions.forEach(option => {
    const key = camelCase(option.label);

    keys.push(key);
    labels[key] = {
      title: option.label,
      description: option.description,
    };
  });

  return [keys, labels];
};

/**
 * @param {DigitalFormComponent} component
 * @returns {[SchemaOptions, UISchemaOptions]}
 */
export default ({ hint, label, required, responseOptions }) => {
  const [keys, labels] = formatResponseOptions(responseOptions);

  return [
    checkboxGroupSchema(keys),
    checkboxGroupUI({ title: label, hint, labels, required }),
  ];
};
