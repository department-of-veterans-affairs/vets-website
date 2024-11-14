import {
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const ethnicityLabels = {
  HL: 'Hispanic or Latino',
  NHL: 'Not Hispanic or Latino',
  NA: 'Prefer not to answer',
};
const raceLabels = {
  isAmericanIndianOrAlaskanNative: 'American Indian or Alaskan Native',
  isAsian: 'Asian',
  isBlackOrAfricanAmerican: 'Black or African American',
  isNativeHawaiianOrOtherPacificIslander:
    'Native Hawaiian or Other Pacific Islander',
  isWhite: 'White',
  noAnswer: 'Prefer not to answer',
};

const uiSchema = {
  ...titleUI('Your ethnicity and race'),
  ethnicity: {
    ...radioUI({
      title: 'What is your ethnicity?',
      labels: ethnicityLabels,
    }),
  },
  originRace: checkboxGroupUI({
    title: 'What is your race?',
    description: 'Select all that you identify with',
    required: false,
    labels: raceLabels,
  }),
};

const schema = {
  type: 'object',
  properties: {
    ethnicity: radioSchema(Object.keys(ethnicityLabels)),
    originRace: checkboxGroupSchema(Object.keys(raceLabels)),
  },
};

export { uiSchema, schema };
