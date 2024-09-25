import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { highestLevelOfEducation } = fullSchema10282.properties;

const uiSchema = {
  highestLevelOfEducation: {
    'ui:title': (
      <h3 className="vads-u-margin--0">
        {' '}
        What’s the highest level of education you have completed?
      </h3>
    ),
    'ui:widget': 'radio',
    'ui:options': {
      labels: highestLevelOfEducation.properties.level.enum,
    },
    level: {
      'ui:widget': 'radio',
      'ui:title': ' ',
    },
    otherEducation: {
      'ui:title': "Enter the highest level of education you've completed.",
      'ui:options': {
        expandUnder: 'level',
        expandUnderCondition: 'Something else',
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    highestLevelOfEducation: {
      type: 'object',
      properties: {
        level: {
          type: 'string',
          enum: highestLevelOfEducation.properties.level.enum,
        },
        otherEducation: {
          type: 'string',
        },
      },
    },
  },
};

export { uiSchema, schema };
