import React from 'react';
import {
  titleUI,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import vaFileNumberUI from 'platform/forms-system/src/js/definitions/vaFileNumber';

const titles = {
  married: "Spouse's identification information",
  separated: "Spouse's identification information",
  divorced: "Previous spouse's identification information",
  widowed: "Deceased spouse's identifcation information",
};

export default {
  title: "Spouse's identification information",
  path: 'spouse-identity',
  uiSchema: {
    ...titleUI(({ formData }) => {
      const statusKey = formData?.maritalStatus?.toLowerCase();
      const title = titles[statusKey] || "Spouse's identification information";

      return <>{title}</>;
    }),
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
    required: ['spouseSsn', 'isSpouseVeteran'],
    properties: {
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
