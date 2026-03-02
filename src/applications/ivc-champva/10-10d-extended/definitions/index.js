import { merge } from 'lodash';
import {
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../locales/en/content.json';

const MIDDLE_NAME_SCHEMA = { type: 'string', maxLength: 1 };

export * from './attachments';
export * from './dates';

export const blankSchema = { type: 'object', properties: {} };

export const fullNameMiddleInitialUI = merge({}, fullNameUI(), {
  middle: { 'ui:title': content['form-label--middle-initial'] },
});
export const fullNameMiddleInitialSchema = merge({}, fullNameSchema, {
  properties: { middle: MIDDLE_NAME_SCHEMA },
});

export const textareaSchema = { type: 'string', maxLength: 155 };
