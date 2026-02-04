import merge from 'lodash/merge';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  phoneUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import content from '../../locales/en/content.json';

const {
  spouseAddress: { properties: schemaOverride },
  spousePhone,
} = ezrSchema.properties;

export const spouseContactInformationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      content['household-spouse-contact-info-title'],
    ),
    spouseAddress: addressUI({
      omit: ['isMilitary'],
      required: {
        state: () => true,
      },
    }),
    spousePhone: {
      ...phoneUI(content['household-spouse-phone-label']),
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
    required: ['spouseAddress'],
  },
};
