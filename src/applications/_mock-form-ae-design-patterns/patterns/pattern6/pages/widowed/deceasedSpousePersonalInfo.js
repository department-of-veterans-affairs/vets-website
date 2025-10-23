import {
  titleUI,
  fullNameUI,
  dateOfBirthUI,
  fullNameSchema,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  title: "Deceased Spouse's Personal Information",
  path: 'deceased-spouse-personal-information',
  depends: formData => formData?.maritalStatus === 'WIDOWED',
  uiSchema: {
    ...titleUI("Deceased spouse's name and date of birth"),
    spouseFullName: {
      ...fullNameUI,
      first: {
        ...fullNameUI.first,
        'ui:title': 'First or given name',
      },
      middle: {
        ...fullNameUI.middle,
        'ui:title': 'Middle name',
      },
      last: {
        ...fullNameUI.last,
        'ui:title': 'Last or family name',
      },
      suffix: {
        ...fullNameUI.suffix,
        'ui:title': 'Suffix',
        'ui:options': {
          placeholder: 'Select',
          uswds: true,
        },
      },
    },
    spouseDateOfBirth: dateOfBirthUI('Date of birth'),
  },
  schema: {
    type: 'object',
    required: ['spouseFullName', 'spouseDateOfBirth'],
    properties: {
      spouseFullName: fullNameSchema,
      spouseDateOfBirth: dateOfBirthSchema,
    },
  },
};
