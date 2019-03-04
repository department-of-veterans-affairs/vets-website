export const uiSchema = {
  'view:trainingProgramsChoice': {
    'ui:title': 'Have you picked a program you’d like to attend using VET TEC?',
    'ui:widget': 'yesNo',
  },
  'view:noProgramsYet': {
    'ui:description':
      'You can still submit this application even if you haven’t picked a program yet. If you’re eligible for VET TEC, we’ll send you a Certificate of Eligibility (COE).',
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
