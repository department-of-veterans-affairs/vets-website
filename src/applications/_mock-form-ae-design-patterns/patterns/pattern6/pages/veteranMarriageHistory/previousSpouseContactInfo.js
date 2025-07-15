import React from 'react';
import {
  addressSchema,
  addressUI,
  titleUI,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { capitalize } from 'lodash';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(({ formData }) => {
      const name = formData?.spouseFullName?.first;
      const readableName = `${capitalize(name)}`.trim();
      const title = name
        ? `${readableName}’s address and phone number`
        : 'Previous spouse’s address and phone number';

      return (
        <>
          <h3 className="vads-u-color--black vads-u-margin-top--0">{title}</h3>
        </>
      );
    }),
    previousSpouseAddress: addressUI({
      labels: {
        militaryCheckbox:
          'My previous spouse lives on a U.S. military base outside of the United States.',
      },
    }),
    previousSpousePhone: phoneUI('Phone number'),
  },
  schema: {
    type: 'object',
    properties: {
      previousSpouseAddress: addressSchema(),
      previousSpousePhone: {
        type: 'string',
        pattern: '^[\\d\\-+\\s()]*$',
      },
    },
  },
};
