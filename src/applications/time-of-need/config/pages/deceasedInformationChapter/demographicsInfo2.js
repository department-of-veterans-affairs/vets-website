import React from 'react';
import {
  titleUI, // added
  radioUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const raceOptions = [
  { value: 'americanIndian' },
  { value: 'asian' },
  { value: 'black' },
  { value: 'hawaiian' },
  { value: 'white' },
  { value: 'other' },
  { value: 'preferNoAnswer' },
];

const raceLabelsObject = {
  americanIndian: 'American Indian or Alaskan Native',
  asian: 'Asian',
  black: 'Black or African American',
  hawaiian: 'Native Hawaiian or other Pacific Islander',
  white: 'White',
  other: 'Other',
  preferNoAnswer: 'Prefer not to answer',
};

const raceKeys = raceOptions.map(opt => opt.value);

export default {
  uiSchema: {
    ...titleUI('Deceased Veteran demographics'), // added header
    'ui:description': (
      <div>
        <p>
          We require demographic information as part of this application. We use
          this information for statistical purposes only.
        </p>
      </div>
    ),
    ethnicity: {
      ...radioUI({
        title: 'What’s the Veteran’s ethnicity?',
        options: [
          { value: 'hispanic', label: 'Hispanic or Latino' },
          { value: 'notHispanic', label: 'Not Hispanic or Latino' },
          { value: 'unknown', label: 'Unknown' },
          { value: 'preferNoAnswer', label: 'Prefer not to answer' },
        ],
      }),
      'ui:options': {
        useV3: true,
      },
    },
    race: {
      ...checkboxGroupUI({
        title: 'What’s the Veteran’s race?',
        description:
          'You can select more than one option, unless you prefer not to answer.',
        required: true,
        options: raceOptions,
        labels: raceLabelsObject,
      }),
      'ui:options': {
        useV3: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['ethnicity', 'race'],
    properties: {
      ethnicity: {
        type: 'string',
        enum: ['hispanic', 'notHispanic', 'unknown', 'preferNoAnswer'],
        enumNames: [
          'Hispanic or Latino',
          'Not Hispanic or Latino',
          'Unknown',
          'Prefer not to answer',
        ],
      },
      race: checkboxGroupSchema(raceKeys),
    },
  },
};
