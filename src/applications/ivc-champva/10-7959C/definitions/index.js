import { merge } from 'lodash';
import {
  addressUI,
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateChars } from '../utils/validation';

export * from './attachments';
export * from './dates';

export const addressWithValidationUI = (options = {}) => {
  const charValidation = { 'ui:validations': [validateChars] };
  return merge({}, addressUI(options), {
    street: charValidation,
    street2: charValidation,
    street3: charValidation,
    city: charValidation,
  });
};

export const blankSchema = { type: 'object', properties: {} };

export const fullNameMiddleInitialUI = merge({}, fullNameUI(), {
  middle: { 'ui:title': 'Middle initial' },
});
export const fullNameMiddleInitialSchema = merge({}, fullNameSchema, {
  properties: { middle: { type: 'string', maxLength: 1 } },
});

export const textareaSchema = { type: 'string', maxLength: 200 };
