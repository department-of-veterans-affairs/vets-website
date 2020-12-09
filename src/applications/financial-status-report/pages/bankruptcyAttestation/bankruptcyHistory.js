const adjudicationOptions = [
  'Yes, I have been adjudicated as bankrupt.',
  'No, I haven’t been adjudicated as bankrupt.',
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
          },
        },
      },
    },
  },
};
