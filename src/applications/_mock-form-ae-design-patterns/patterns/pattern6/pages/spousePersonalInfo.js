import React from 'react';
import {
  titleUI,
  fullNameUI,
  dateOfBirthUI,
  fullNameSchema,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
// import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

const titles = {
  married: "Spouse's name and date of birth",
  separated: "Spouse's name and date of birth",
  divorced: "Previous spouse's name and date of birth",
  widowed: "Deceased spouse's name and date of birth",
};

export default {
  title: "Spouse's Personal Information",
  path: 'spouse-personal-information',
  // depends: formData => formData?.maritalStatus !== 'NEVER_MARRIED',
  uiSchema: {
    ...titleUI(({ formData }) => {
      const statusKey = formData?.maritalStatus?.toLowerCase();
      const title = titles[statusKey] || "Spouse's name and date of birth";

      return <>{title}</>;
    }),
    // ...titleUI('Spouse’s name and date of birth'),
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
    // 'view:previousSpouseIsDeceased': {
    //   'ui:title': 'My previous spouse is deceased.',
    //   'ui:webComponentField': VaCheckboxField,
    //   // 'ui:options': {
    //   //   hideIf: formData => formData?.maritalStatus !== 'DIVORCED',
    //   // },
    // },
  },
  schema: {
    type: 'object',
    required: ['spouseFullName', 'spouseDateOfBirth'],
    properties: {
      spouseFullName: fullNameSchema,
      spouseDateOfBirth: dateOfBirthSchema,
      // 'view:previousSpouseIsDeceased': {
      //   type: 'boolean',
      //   default: false,
      // },
    },
  },
};
