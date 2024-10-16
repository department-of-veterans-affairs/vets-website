import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { highestLevelOfEducation } = fullSchema10282.properties;

const uiSchema = {
  highestLevelOfEducation: {
    'ui:title': (
      <h3
        className="vads-u-margin--0 vads-u-color--base"
        data-testid="optional-education"
      >
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
      'ui:title': (
        <p className="vads-u-margin--0" data-testid="something-else-edu">
          Enter the highest level of education you’ve completed.
        </p>
      ),
      'ui:options': {
        // expandUnder: 'level',
        hideIf: formData =>
          formData.highestLevelOfEducation.level !== 'Something else',
        classNames:
          'schemaform-field-template vads-u-margin-left--4 vads-u-margin-top--neg3 form-expanding-group-open',
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
