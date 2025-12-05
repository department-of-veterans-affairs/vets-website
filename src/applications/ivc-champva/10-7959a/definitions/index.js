import { merge } from 'lodash';
import {
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../locales/en/content.json';

export const blankSchema = { type: 'object', properties: {} };

export const champvaMemberNumberSchema = {
  type: 'string',
  pattern: '^[0-9]+$',
  maxLength: 9,
  minLength: 8,
};

export const fileUploadSchema = {
  type: 'array',
  minItems: 1,
  items: { type: 'object', properties: { name: { type: 'string' } } },
};

export const fullNameMiddleInitialUI = merge({}, fullNameUI(), {
  middle: { 'ui:title': content['form-label--middle-initial'] },
});
export const fullNameMiddleInitialSchema = merge({}, fullNameSchema, {
  properties: { middle: { type: 'string', maxLength: 1 } },
});
