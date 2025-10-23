import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const employmentFocusOptions = {
  computerProgramming: 'Computer programming',
  computerSoftware: 'Computer software',
  mediaApplication: 'Media application',
  dataProcessing: 'Data processing',
  informationSciences: 'Information sciences',
  // somethingElse: 'Something else',
};

const uiSchema = {
  ...titleUI('Your main area of focus'),
  technologyAreaOfFocus: {
    ...radioUI({
      title: 'What’s your main area of focus in the technology industry?',
      required: formData => formData.isInTechnologyIndustry === true,
      labels: employmentFocusOptions,
    }),
  },
  // otherFocus: {
  //   ...textUI({
  //     title: 'Enter your area of focus in the technology industry.',
  //   }),
  //   'ui:options': {
  //     hideIf: formData => formData.technologyAreaOfFocus !== 'somethingElse',
  //     expandUnder: 'technologyAreaOfFocus',
  //     expandUnderCondition: 'somethingElse',
  //     expandedContentFocus: true,
  //     preserveHiddenData: true,
  //     classNames: 'vads-u-margin-top--neg1',
  //   },
  // },
};

const schema = {
  type: 'object',
  properties: {
    technologyAreaOfFocus: radioSchema(Object.keys(employmentFocusOptions)),
    // otherFocus: {
    //   type: 'string',
    //   pattern: '^(?!\\s*$).+',
    // },
  },
};
export { schema, uiSchema };
