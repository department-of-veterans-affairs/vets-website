import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const educationLevels = {
  HS: 'A high school diploma',
  AD: 'An associate degree',
  BD: "A bachelor's degree",
  MD: "A master's degree",
  DD: 'A doctoral degree like a PhD',
  OTHER: 'Other',
  // NA: 'Something else',
};

const uiSchema = {
  ...titleUI('Your education'),
  highestLevelOfEducation: {
    ...radioUI({
      title: 'What’s the highest level of education you’ve completed?',
      labels: educationLevels,
    }),
  },
  // otherLevel: {
  //   ...textUI({
  //     title: 'Enter the highest level of education you’ve completed.',
  //   }),
  //   'ui:options': {
  //     hideIf: formData => formData.highestLevelOfEducation !== 'NA',
  //     expandUnder: 'highestLevelOfEducation',
  //     expandUnderCondition: 'NA',
  //     expandedContentFocus: true,
  //     preserveHiddenData: true,
  //     classNames: 'vads-u-margin-top--neg1',
  //   },
  // },
};

const schema = {
  type: 'object',
  properties: {
    highestLevelOfEducation: radioSchema(Object.keys(educationLevels)),
    // otherLevel: {
    //   type: 'string',
    //   pattern: '^(?!\\s*$).+',
    // },
  },
};

export { schema, uiSchema };
