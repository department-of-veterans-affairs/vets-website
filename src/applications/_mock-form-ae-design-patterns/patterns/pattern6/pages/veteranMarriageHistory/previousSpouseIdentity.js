import React from 'react';
import {
  titleUI,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import vaFileNumberUI from 'platform/forms-system/src/js/definitions/vaFileNumber';
import { capitalize } from 'lodash';

export default {
  uiSchema: {
    ...titleUI(({ formData }) => {
      const name = formData?.spouseFullName?.first;
      const readableName = `${capitalize(name)}`.trim();
      const title = name
        ? `${readableName}’s identification information`
        : "Previous Spouse's identification information";

      return (
        <>
          <h3 className="vads-u-color--black">{title}</h3>
        </>
      );
    }),
    spouseSsn: ssnUI('Social Security Number'),
    isSpouseVeteran: {
      'ui:title': 'Is your previous spouse also a Veteran?',
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
