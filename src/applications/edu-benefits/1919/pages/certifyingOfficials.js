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
const noSpaceOnlyPattern = '^(?!\\s*$).+';
const uiSchema = {
  certifyingOfficial: {
    ...titleUI('Your name and role'),
    first: {
      ...textUI({
        title: 'First name',
        errorMessages: {
          required: 'Please enter a first name',
          pattern: 'You must provide a response',
        },
      }),
    },
    last: {
      ...textUI({
        title: 'Last name',
        errorMessages: {
          required: 'Please enter a last name',
          pattern: 'You must provide a response',
        },
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
        'ui:title': 'Please specify your role',
        'ui:errorMessages': {
          required: 'Your role must be specified',
          pattern: 'You must provide a response',
        },
        'ui:required': formData =>
          formData.certifyingOfficial?.role?.level === 'Other',
        'ui:options': {
          expandUnder: 'level',
          expandUnderCondition: 'Other',
          expandedContentFocus: true,
          preserveHiddenData: true,
          classNames: 'vads-u-margin-top--neg1',
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
        first: { ...textSchema, pattern: noSpaceOnlyPattern },
        last: { ...textSchema, pattern: noSpaceOnlyPattern },
        role: {
          type: 'object',
          required: ['level'],
          properties: {
            level: radioSchema(Object.values(levelNames)),
            other: { type: 'string', pattern: noSpaceOnlyPattern },
          },
        },
      },
    },
  },
};

export { uiSchema, schema };
