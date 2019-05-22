import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';

const { hasSelectedPrograms } = fullSchema.properties;

export const uiSchema = {
  hasSelectedPrograms: {
    'ui:title': 'Have you picked a program you’d like to attend using VET TEC?',
    'ui:widget': 'yesNo',
  },
  'view:noProgramsYet': {
    'ui:description':
      'You can still submit this application even if you haven’t picked a program yet. If you’re eligible for VET TEC, we’ll send you a Certificate of Eligibility (COE).',
  },
};

export const schema = {
  type: 'object',
  properties: {
    hasSelectedPrograms,
    'view:noProgramsYet': {
      type: 'object',
      properties: {},
    },
  },
};
