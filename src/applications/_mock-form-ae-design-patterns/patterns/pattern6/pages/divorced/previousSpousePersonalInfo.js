import {
  titleUI,
  fullNameUI,
  dateOfBirthUI,
  fullNameSchema,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

export default {
  title: "Previous Spouse's Personal Information",
  path: 'previous-spouse-personal-information',
  depends: formData => formData?.maritalStatus === 'DIVORCED',
  uiSchema: {
    ...titleUI("Previous spouse's name and date of birth"),
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
    'view:previousSpouseIsDeceased': {
      'ui:title': 'My previous spouse is deceased.',
      'ui:webComponentField': VaCheckboxField,
      // 'ui:options': {
      //   hideIf: formData =>
      //     formData.maritalStatus !== 'DIVORCED' &&
      //     formData['view:completedVeteranFormerMarriage'] !== true,
      // },
      'ui:options': {
        hideIf: formData =>
          formData.maritalStatus === 'DIVORCED' &&
          formData.veteranMarriageHistory.length < 2,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['spouseFullName', 'spouseDateOfBirth'],
    properties: {
      spouseFullName: fullNameSchema,
      spouseDateOfBirth: dateOfBirthSchema,
      'view:previousSpouseIsDeceased': {
        type: 'boolean',
        default: false,
      },
    },
  },
};
