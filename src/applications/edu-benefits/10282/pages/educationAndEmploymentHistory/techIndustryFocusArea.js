import {
  titleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const focusAreas = {
  CP: 'Computer programming',
  CS: 'Computer software',
  DP: 'Data processing',
  IS: 'Information sciences',
  MA: 'Media application',
  NA: 'Something else not listed here',
};
const uiSchema = {
  ...titleUI('Your main area of focus'),
  techIndustryFocusArea: radioUI({
    title: 'What’s your main area of focus in the technology industry?',
    labels: focusAreas,
  }),
};

const schema = {
  type: 'object',
  properties: {
    techIndustryFocusArea: radioSchema(Object.keys(focusAreas)),
  },
};

export { uiSchema, schema };
