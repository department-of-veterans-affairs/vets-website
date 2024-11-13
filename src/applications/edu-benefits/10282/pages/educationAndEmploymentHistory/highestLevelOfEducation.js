import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { highestLevelOfEducation } = fullSchema10282.properties;

const uiSchema = {
  ...titleUI('Education'),
  highestLevelOfEducation: {
    'ui:widget': 'radio',
    'ui:options': {
      labels: highestLevelOfEducation.properties.level.enum,
    },
    level: {
      'ui:widget': 'radio',
      'ui:title': 'What’s the highest level of education you have completed?',
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
          'schemaform-field-template vads-u-margin-left--4 vads-u-margin-top--neg2 form-expanding-group-open',
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
