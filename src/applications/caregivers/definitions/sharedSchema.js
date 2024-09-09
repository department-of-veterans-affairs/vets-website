import { merge, omit } from 'lodash';
import {
  yesNoSchema,
  addressNoMilitarySchema,
  fullNameSchema as platformFullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

// declare schema for use with non-autofill address definitions
export const addressSchema = definition =>
  merge(
    {},
    addressNoMilitarySchema({ omit: ['street3'] }),
    omit(definition, ['additionalProperties', 'required']),
  );

// declare schema for use with autofill address definitions
export const addressWithAutofillSchema = definition =>
  merge({}, addressSchema(definition), {
    properties: {
      'view:autofill': yesNoSchema,
    },
  });

// declare full name schema override
export const fullNameSchema = definition =>
  merge({}, platformFullNameSchema, definition);

// declare empty schema for use with `view:`-type fields
export const emptySchema = {
  type: 'object',
  properties: {},
};
