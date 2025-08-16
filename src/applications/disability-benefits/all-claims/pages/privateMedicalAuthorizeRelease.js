export const uiSchema = {
  patient4142Acknowledgement: {
    'ui:title':
      'I authorize the release of my non-VA medical records to the VA',
  },
};

export const schema = {
  type: 'object',
  properties: {
    patient4142Acknowledgement: {
      type: 'boolean',
      default: false,
    },
  },
};
