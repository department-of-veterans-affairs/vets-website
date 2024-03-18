export const uiSchema = {
  application: {
    'ui:title': ' ',
    applicant: {
      'ui:title': ' ',
      isSponsor: {
        'ui:title': 'Are you the applicant’s sponsor?',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            yes: 'Yes',
            no: 'No',
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        applicant: {
          type: 'object',
          required: ['isSponsor'],
          properties: {
            isSponsor: {
              type: 'string',
              enum: ['yes', 'no'],
            },
          },
        },
      },
    },
  },
};
