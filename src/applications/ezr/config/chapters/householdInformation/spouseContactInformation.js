import merge from 'lodash/merge';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  titleUI,
  phoneUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

const {
  spouseAddress: { properties: schemaOverride },
  spousePhone,
} = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(content['household-spouse-contact-info-title']),
    spouseAddress: addressUI({ omit: ['isMilitary'] }),
    spousePhone: {
      ...phoneUI(content['household-sponse-phone-label']),
      'ui:errorMessages': {
        required: content['phone-number-error-message'],
        pattern: content['phone-number-error-message'],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      spouseAddress: merge({}, addressSchema({ omit: ['isMilitary'] }), {
        properties: schemaOverride,
      }),
      spousePhone,
    },
  },
};
