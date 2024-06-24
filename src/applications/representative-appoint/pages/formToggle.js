export const uiSchema = {
  veteranRadio: {
    'ui:title': `Are you a veteran?`,
    'ui:widget': 'radio',
    'ui:options': {
      widgetProps: {
        'Yes veteran': { 'data-info': 'yes_veteran' },
        'No veteran': { 'data-info': 'no_veteran' },
      },
      selectedProps: {
        'Yes veteran': { 'aria-describedby': 'yes_veteran' },
        'No veteran': { 'aria-describedby': 'no_veteran' },
      },
      'ui:errorMessages': {
        required: 'Field is required',
      },
    },
  },
  repTypeRadio: {
    'ui:title': `What type of representative are you appointing?`,
    'ui:widget': 'radio',
    'ui:options': {
      widgetProps: {
        'Veterans Service Organization (VSO)': {
          'data-info': 'veterans_service_organization',
        },
        Attorney: { 'data-info': 'attorney' },
        'Claims Agent': { 'data-info': 'claims_agent' },
      },
      selectedProps: {
        'Veterans Service Organization (VSO)': {
          'aria-describedby': 'veterans_service_organization',
        },
        Attorney: { 'aria-describedby': 'attorney' },
        'Claims Agent': { 'aria-describedby': 'claims_agent' },
      },
      'ui:errorMessages': {
        required: 'Field is required',
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['veteranRadio', 'repTypeRadio'],
  properties: {
    veteranRadio: {
      type: 'string',
      enum: [`Yes`, `No`],
    },
    repTypeRadio: {
      type: 'string',
      enum: ['Veterans Service Organization (VSO)', 'Attorney', 'Claims Agent'],
    },
  },
};
