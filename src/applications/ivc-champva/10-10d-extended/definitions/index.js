import { merge } from 'lodash';
import {
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../locales/en/content.json';

const MIDDLE_NAME_SCHEMA = { type: 'string', maxLength: 1 };

export const blankSchema = { type: 'object', properties: {} };

export const fileUploadSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
  },
};
export const fileUploadWithMetadataSchema = ({
  enumNames = [],
  minItems = 1,
} = {}) => {
  const options = Array.isArray(enumNames) ? enumNames : [];
  const normalized = options.map(opt => opt.trim()).filter(Boolean);

  // de-duplicate while preserving first-seen order
  const enumValues = [...new Set(normalized)];

  // coerce minItems to a safe non-negative integer (default 1)
  const safeMin =
    Number.isFinite(minItems) && minItems >= 0 ? Math.floor(minItems) : 1;

  return {
    type: 'array',
    minItems: safeMin,
    items: {
      type: 'object',
      required: ['attachmentId', 'name'],
      properties: {
        name: {
          type: 'string',
        },
        attachmentId: {
          type: 'string',
          enum: enumValues,
          enumNames: enumValues,
        },
      },
    },
  };
};

export const fullNameMiddleInitialUI = merge({}, fullNameUI(), {
  middle: { 'ui:title': content['form-label--middle-initial'] },
});
export const fullNameMiddleInitialSchema = merge({}, fullNameSchema, {
  properties: { middle: MIDDLE_NAME_SCHEMA },
});
