import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {UISchemaOptions} */

export const uiSchema = {
  'view:applicantIsVeteran': radioUI({
    title: 'Are you the Veteran?',
  }),
};

/** @type {SchemaOptions} */

export const schema = {
  type: 'object',
  required: ['view:applicantIsVeteran'],
  properties: {
    'view:applicantIsVeteran': radioSchema(['Yes', 'No']),
  },
};
