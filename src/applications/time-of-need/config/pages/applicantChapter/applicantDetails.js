import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const applicantDetails = {
  uiSchema: {
    'ui:title': 'Your details',
    firstName: textUI({
      title: 'First name',
    }),
    middleName: textUI({
      title: 'Middle name',
    }),
    lastName: textUI({
      title: 'Last name',
    }),
    suffix: {
      'ui:title': 'Suffix',
      'ui:widget': 'select',
      'ui:options': {
        widgetProps: {
          messageAriaDescribedby: 'Select a suffix if applicable',
        },
      },
    },
    maidenName: textUI({
      title: 'Maiden name',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      firstName: {
        ...textSchema,
        maxLength: 30,
      },
      middleName: {
        ...textSchema,
        maxLength: 30,
      },
      lastName: {
        ...textSchema,
        maxLength: 30,
      },
      suffix: {
        type: 'string',
        enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'],
      },
      maidenName: {
        ...textSchema,
        maxLength: 30,
      },
    },
    required: ['firstName', 'lastName'],
  },
};

export default applicantDetails;
