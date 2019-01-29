// These two must be added back in once schema is updatedß
// import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';

// const { highestLevelofEducation } = fullSchema.properties;

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
    highestLevelofEducation: {
      type: 'string',
      enum: [
        'high_school_diploma_or_GED',
        'some_college',
        'associates_degree',
        'bachelors_degree',
        'masters_degree',
        'doctoral_degree',
        'other',
      ],
      enumNames: [
        'High school diploma or GED',
        'Some college',
        'Associate’s degree',
        'Bachelor’s degree',
        'Master’s degree',
        'Doctoral degree',
        'Other',
      ],
    },
    otherEducation: {
      type: 'string',
    },
  },
};
