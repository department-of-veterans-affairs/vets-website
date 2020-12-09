const adjudicationOptions = [
  'Yes, I have been adjudicated as bankrupt.',
  'No, I haven’t been adjudicated as bankrupt.',
];

const mortgageOptions = [
  'Yes, VA or a mortgage company was involved in this bankruptcy.',
  'No, VA or a mortgage company wasn’t involved in this bankruptcy.',
];

export const uiSchema = {
  bankruptcyHistory: {
    adjudicated: {
      'ui:title': 'Have you ever been adjudicated as bankrupt?',
      'ui:required': () => true,
      'ui:widget': 'radio',
    },
    hasBeenAdjudicated: {
      'ui:options': {
        expandUnder: 'adjudicated',
        expandUnderCondition: 'Yes, I have been adjudicated as bankrupt.',
      },
      bankruptcyDischargeDate: {
        'ui:title': 'Date discharged from bankruptcy',
        'ui:widget': 'date',
      },
      courtLocation: {
        'ui:title': 'Location of court',
      },
      docketNumber: {
        'ui:title': 'Docket number',
      },
      mortgageCompany: {
        'ui:title': 'Was VA or a mortgage company involved in this bankruptcy?',
        'ui:required': () => true,
        'ui:widget': 'radio',
      },
      vaInvolved: {
        'ui:options': {
          expandUnder: 'mortgageCompany',
          expandUnderCondition:
            'Yes, VA or a mortgage company was involved in this bankruptcy.',
        },
        fileTypes: {
          'ui:title': 'Accepted file types: ',
          'ui:description': 'pdf, gif, jpeg, jpg, bmp, txt',
        },
        fileSize: {
          'ui:title': 'Maximum file size: ',
          'ui:description': '50MB',
        },
        bankruptcyComments: {
          'ui:title':
            'Provide additional details about your bankruptcy if needed. (400 characters maximum)',
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 5,
            maxLength: 400,
          },
        },
      },
      vaNotInvolved: {
        'ui:options': {
          expandUnder: 'mortgageCompany',
          expandUnderCondition:
            'No, VA or a mortgage company wasn’t involved in this bankruptcy.',
        },
        bankruptcyComments: {
          'ui:title':
            'Provide additional details about your bankruptcy if needed. (400 characters maximum)',
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 5,
            maxLength: 400,
          },
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    bankruptcyHistory: {
      type: 'object',
      properties: {
        adjudicated: {
          type: 'string',
          enum: adjudicationOptions,
        },
        hasBeenAdjudicated: {
          type: 'object',
          properties: {
            bankruptcyDischargeDate: {
              type: 'string',
            },
            courtLocation: {
              type: 'string',
            },
            docketNumber: {
              type: 'string',
            },
            mortgageCompany: {
              type: 'string',
              enum: mortgageOptions,
            },
            vaInvolved: {
              type: 'object',
              properties: {
                fileTypes: {
                  type: 'string',
                },
                fileSize: {
                  type: 'string',
                },
                bankruptcyComments: {
                  type: 'string',
                },
              },
            },
            vaNotInvolved: {
              type: 'object',
              properties: {
                bankruptcyComments: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};
