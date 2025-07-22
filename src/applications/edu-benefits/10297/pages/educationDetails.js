import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const educationLevels = {
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
    focus: {
      ...radioUI({
        title: 'What’s your main area of focus in the technology industry? ',
        labels: educationLevels,
      }),
    },
  },
};
const schema = {
  type: 'object',
  required: ['highestLevelOfEducation'],
  properties: {
    highestLevelOfEducation: {
      type: 'object',
      properties: {
        focus: {
          ...radioSchema(Object.keys(educationLevels)),
        },
      },
    },
  },
};
export { schema, uiSchema };
