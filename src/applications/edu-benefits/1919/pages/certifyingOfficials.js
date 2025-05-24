import {
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns/textPatterns';
import {
  titleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const levelNames = {
  certifyingOfficial: 'Certifying official',
  owner: 'Owner',
  officer: 'Officer',
  other: 'Other',
};
const uiSchema = {
  certifyingOfficial: {
    ...titleUI('Your name and role'),
    first: {
      ...textUI({
        title: 'First name',
        errorMessages: { required: 'Please enter a first name' },
      }),
    },
    last: {
      ...textUI({
        title: 'Last name',
        errorMessages: { required: 'Please enter a last name' },
      }),
    },
    role: {
      level: {
        ...radioUI({
          title:
            'Which of the following best describes your role at this institution?',
          errorMessages: { required: 'Please make a selection' },
          labels: levelNames,
        }),
      },
      other: {
        ...textUI({
          title: 'Please specify your role',
          errorMessages: { required: 'Your role must be specified' },
          required: formData =>
            formData.certifyingOfficial?.role?.level === 'Other',
        }),
        'ui:options': {
          hideIf: formData =>
            formData.certifyingOfficial?.role?.level !== 'Other',
          classNames:
            'vads-u-margin-left--5 vads-u-margin-top--neg4 other-role',
        },
      },
    },
  },
};
const schema = {
  type: 'object',
  properties: {
    certifyingOfficial: {
      type: 'object',
      required: ['first', 'last', 'role'],
      properties: {
        first: textSchema,
        last: textSchema,
        role: {
          type: 'object',
          required: ['level'],
          properties: {
            level: radioSchema(Object.values(levelNames)),
            other: textSchema,
          },
        },
      },
    },
  },
};

export { uiSchema, schema };
