import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    additionalInformation: {
      'ui:title':
        'Do you have more information to help support this certification? You may add details about your relationship to the person with the claim. You may also tell us more about why you need to sign for them.',
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
