import {
  titleUI,
  textUI,
  textSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI(
      'Your spouse information',
      'Please fill out your personal information below.',
    ),
    spouseFirstName: {
      ...textUI({
        title: 'First name',
        errorMessages: { required: 'Enter a first name' },
      }),
      'ui:options': { useV3: true },
    },
    spouseLastName: {
      ...textUI({
        title: 'Last name',
        errorMessages: { required: 'Enter a last name' },
      }),
      'ui:options': { useV3: true },
    },
    spouseDateOfBirth: {
      ...dateOfBirthUI({
        title: 'Date of Birth',
        description: 'For example: January 19 2000',
      }),
      'ui:options': { useV3: true },
    },
    spouseSsn: {
      ...ssnUI(),
      'ui:title': 'Social Security Number',
      'ui:options': { useV3: true },
    },
  },
  schema: {
    type: 'object',
    required: ['spouseFirstName', 'spouseLastName', 'spouseDateOfBirth'],
    properties: {
      spouseFirstName: textSchema,
      spouseLastName: textSchema,
      spouseDateOfBirth: dateOfBirthSchema,
      spouseSsn: {
        ...ssnSchema,
        title: 'Social Security Number',
      },
    },
  },
};
