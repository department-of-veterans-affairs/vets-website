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
    ...radioUI({
      title: 'What’s the highest level of education you’ve completed?',
      labels: educationLevels,
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    highestLevelOfEducation: radioSchema(Object.keys(educationLevels)),
  },
};
export { schema, uiSchema };
