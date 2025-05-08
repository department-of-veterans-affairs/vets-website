import {
  titleUI,
  fullNameUI,
  ssnUI,
  dateOfBirthUI,
  fullNameSchema,
  dateOfBirthSchema,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import vaFileNumberUI from 'platform/forms-system/src/js/definitions/vaFileNumber';

export default {
  title: "Spouse's Personal Information",
  path: 'spouse-personal-information',
  depends: formData => formData?.maritalStatus === 'MARRIED',
  uiSchema: {
    ...titleUI("Spouse's Personal Information"),
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
    spouseSsn: ssnUI('Social Security Number'),
    isSpouseVeteran: {
      'ui:title': 'Is your spouse also a Veteran?',
      'ui:widget': 'yesNo',
    },
    vaFileNumber: {
      ...vaFileNumberUI,
      'ui:title': "Spouse's VA file number",
      'ui:required': formData => formData.isSpouseVeteran === true,
      'ui:options': {
        expandUnder: 'isSpouseVeteran',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: [
      'spouseFullName',
      'spouseDateOfBirth',
      'spouseSsn',
      'isSpouseVeteran',
    ],
    properties: {
      spouseFullName: fullNameSchema,
      spouseDateOfBirth: dateOfBirthSchema,
      spouseSsn: ssnSchema,
      isSpouseVeteran: {
        type: 'boolean',
      },
      vaFileNumber: {
        type: 'string',
        pattern: '^[0-9]{8,9}$',
      },
    },
  },
};
