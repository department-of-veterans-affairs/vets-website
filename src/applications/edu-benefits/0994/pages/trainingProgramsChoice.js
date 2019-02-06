export const uiSchema = {
  'view:trainingProgramsChoice': {
    'ui:title':
      'Have you picked any programs you’d like to attend using VET TEC benefits?',
    'ui:widget': 'yesNo',
    'ui:options': {
      labels: {
        Y: 'Yes',
        N: 'Not yet',
      },
    },
  },
  'view:noProgramsYet': {
    'ui:description':
      'If you haven’t picked a program yet, you can still submit this application. We’ll send a Certificate of Eligibility (COE) if you’re eligible for VET TEC.',
    'ui:options': {
      expandUnder: 'view:trainingProgramsChoice',
      expandUnderCondition: false,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:trainingProgramsChoice': {
      type: 'boolean',
    },
    'view:noProgramsYet': {
      type: 'object',
      properties: {},
    },
  },
};
