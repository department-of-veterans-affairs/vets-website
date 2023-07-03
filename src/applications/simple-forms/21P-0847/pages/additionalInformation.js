import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    additionalInformation: {
      'ui:title':
        'Do you have more information to help support your application? You may include additional information here about your relationship to the Veteran or claimant, identification of the benefits sought, or any other pertinent information.',
      'ui:webComponentField': VaTextareaField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalInformation: {
        type: 'string',
      },
    },
  },
};
