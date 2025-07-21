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
  somethingElse: 'Something else not listed here',
};

const uiSchema = {
  ...titleUI('Your main are of focus'),
  technologyAreaOfFocus: {
    focus: {
      ...radioUI({
        title: 'What’s your main area of focus in the technology industry? ',
        errorMessages: { required: 'You must provide a response' },
        labels: employmentFocusOptions,
      }),
    },
  },
};
const schema = {
  type: 'object',
  required: ['technologyAreaOfFocus'],
  properties: {
    technologyAreaOfFocus: {
      type: 'object',
      required: ['focus'],
      properties: {
        focus: {
          ...radioSchema(Object.keys(employmentFocusOptions)),
        },
      },
    },
  },
};
export { schema, uiSchema };
