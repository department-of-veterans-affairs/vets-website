import {
  titleUI,
  fullNameUI,
  ssnUI,
  dateOfBirthUI,
  fullNameSchema,
  dateOfBirthSchema,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  title: "Your Spouse's Personal Information",
  path: 'spouse-information/personal',
  depends: formData => formData?.maritalStatus === 'MARRIED',
  uiSchema: {
    ...titleUI("Your Spouse's Personal Information"),
    spouseFullName: {
      ...fullNameUI,
      first: {
        ...fullNameUI.first,
        'ui:title': 'First Name',
      },
      middle: {
        ...fullNameUI.middle,
        'ui:title': 'Middle Name',
      },
      last: {
        ...fullNameUI.last,
        'ui:title': 'Last Name',
      },
    },
    spouseDateOfBirth: dateOfBirthUI('Date of birth'),
    spouseSsn: ssnUI('Social Security Number'),
  },
  schema: {
    type: 'object',
    required: ['spouseFullName', 'spouseDateOfBirth', 'spouseSsn'],
    properties: {
      spouseFullName: fullNameSchema,
      spouseDateOfBirth: dateOfBirthSchema,
      spouseSsn: ssnSchema,
    },
  },
};
