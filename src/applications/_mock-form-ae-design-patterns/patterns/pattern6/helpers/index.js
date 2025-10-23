import {
  titleUI,
  fullNameUI,
  dateOfBirthUI,
  fullNameSchema,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

function getSpouseTitle(formData) {
  const titles = {
    married: "Spouse's Personal Information",
    separated: "Spouse's Personal Information",
    divorced: "Previous Spouse's Personal Information",
    widowed: "Deceased Spouse's Personal Information",
  };

  const statusKey = formData?.maritalStatus?.toLowerCase();
  return titles[statusKey] || 'Spouse Information';
}
const buildSpousePage = formData => ({
  title: getSpouseTitle(formData),
  path: 'spouse-personal-information',
  depends: () =>
    ['MARRIED', 'SEPARATED', 'DIVORCED', 'WIDOWED'].includes(
      formData?.maritalStatus,
    ),
  uiSchema: {
    ...titleUI(getSpouseTitle(formData)),
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
});

export default buildSpousePage;
