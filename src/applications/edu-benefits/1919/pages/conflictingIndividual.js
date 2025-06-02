import {
  titleUI,
  textSchema,
  textUI,
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

const associationLabels = {
  vaEmployee:
    'They are a VA employee who works with, receives services from, or receives compensation from our institution',
  saaEmployee:
    'They are a SAA employee who works with or receives compensation from our institution',
};
const noSpaceOnlyPattern = '^(?!\\s*$).+';

const uiSchema = {
  ...titleUI('Individuals affiliated with both your institution and VA or SAA'),
  first: {
    ...textUI({
      title: 'First name of individual',
      errorMessages: {
        required: 'Please enter a first name',
        pattern: 'You must provide a response',
      },
    }),
  },
  last: {
    ...textUI({
      title: 'Last name of individual',
      errorMessages: {
        required: 'Please enter a last name',
        pattern: 'You must provide a response',
      },
    }),
  },
  title: {
    ...textUI({
      title: 'Title of individual',
      errorMessages: {
        required: 'Please enter a title',
        pattern: 'You must provide a response',
      },
    }),
  },
  association: {
    ...radioUI({
      title: 'How is this individual associated with your institution?',
      errorMessages: { required: 'Please make a selection' },
      labels: associationLabels,
    }),
  },
};

const schema = {
  type: 'object',
  required: ['first', 'last', 'title', 'association'],
  properties: {
    first: { ...textSchema, pattern: noSpaceOnlyPattern },
    last: { ...textSchema, pattern: noSpaceOnlyPattern },
    title: { ...textSchema, pattern: noSpaceOnlyPattern },
    association: {
      ...radioSchema(['vaEmployee', 'saaEmployee']),
    },
  },
};

export { uiSchema, schema };
