import { merge } from 'lodash';
import {
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const blankSchema = { type: 'object', properties: {} };

export const fullNameMiddleInitialUI = merge({}, fullNameUI(), {
  middle: { 'ui:title': 'Middle initial' },
});
export const fullNameMiddleInitialSchema = merge({}, fullNameSchema, {
  properties: { middle: { type: 'string', maxLength: 1 } },
});

export const singleFileUploadSchema = {
  type: 'array',
  maxItems: 1,
  items: { type: 'object', properties: { name: { type: 'string' } } },
};

export const textareaSchema = { type: 'string', maxLength: 200 };
