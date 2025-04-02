import React from 'react';
import {
  titleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const degreeTypes = {
  HS: 'A high school diploma or GED',
  AD: 'An associate degree',
  BD: "A bachelor's degree",
  MD: "A master's degree",
  DD: 'A doctoral degree like a PhD',
  NA: 'Something else',
};

const uiSchema = {
  ...titleUI('Your education'),
  highestLevelOfEducation: {
    level: {
      ...radioUI({
        title: 'What’s the highest level of education you have completed?',
        labels: degreeTypes,
      }),
    },
    otherEducation: {
      'ui:title': (
        <p data-testid="something-else-edu">
          Enter the highest level of education you’ve completed.
        </p>
      ),
      'ui:options': {
        // expandUnder: 'level',
        hideIf: formData => formData.highestLevelOfEducation.level !== 'NA',
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
        level: radioSchema(Object.keys(degreeTypes)),
        otherEducation: {
          type: 'string',
        },
      },
    },
  },
};

export { uiSchema, schema };
