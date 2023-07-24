import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    additionalInformation: {
      'ui:title':
        'Do you have more information to support your request? You can tell us about your relationship to the deceased claimant, the claim they were working on, or any other relevant information.',
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
