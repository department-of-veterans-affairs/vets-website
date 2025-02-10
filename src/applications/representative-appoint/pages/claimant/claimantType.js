import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {UISchemaOptions} */

export const uiSchema = {
  inputVeteranIsClaimant: radioUI({
    title: 'Are you the Veteran?',
  }),
};

/** @type {SchemaOptions} */

export const schema = {
  type: 'object',
  required: ['inputVeteranIsClaimant'],
  properties: {
    inputVeteranIsClaimant: radioSchema(['Yes', 'No']),
  },
};
