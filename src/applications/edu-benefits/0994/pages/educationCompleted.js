import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';

const { highestLevelofEducation } = fullSchema.properties;

export const uiSchema = {
  highestLevelofEducation: {
    'ui:title': 'What’s the highest level of education you’ve completed?',
  },
  otherEducation: {
    'ui:title': 'Other education completed',
    'ui:options': {
      expandUnder: 'highestLevelofEducation',
      expandUnderCondition: educationChoice => educationChoice === 'other',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    highestLevelofEducation,
    otherEducation: {
      type: 'string',
    },
  },
};
