import {
  radioUI,
  radioSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { getThirdPartyName } from '../helpers';

const securityOptions = {
  pin: 'I would like to use a pin or password',
  motherBornLocation: 'The city and state your mother was born in',
  highSchool: 'The name of the high school you attended',
  petName: "Your first pet's name",
  teacherName: "Your favorite teacher's name",
  fatherMiddleName: "Your father's middle name",
  create: 'Create your own question and answer',
};

const uiSchema = {
  ...titleUI('Select a security setup option'),
  securityQuestion: {
    question: {
      ...radioUI({
        labels: securityOptions,
        errorMessages: {
          required: 'You must select a security option',
        },
      }),
    },
    'ui:options': {
      updateUiSchema: (formData, fullData) => {
        const name = getThirdPartyName(formData || fullData);
        return {
          question: {
            'ui:title': `Select a security option that ${name} can use to prove they have permission to access your VA information.`,
          },
        };
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    securityQuestion: {
      type: 'object',
      properties: {
        question: radioSchema(Object.keys(securityOptions)),
      },
      required: ['question'],
    },
  },
};

export { schema, uiSchema };
