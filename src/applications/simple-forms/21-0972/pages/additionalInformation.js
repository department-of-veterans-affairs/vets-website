import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    additionalInformation: {
      'ui:title':
        'Do you have more information to help support your application? You may include additional information here about your relationship information to the Veteran or Claimant and you may also provide the VA with a rationale for the necessity of an alternate signer.',
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
