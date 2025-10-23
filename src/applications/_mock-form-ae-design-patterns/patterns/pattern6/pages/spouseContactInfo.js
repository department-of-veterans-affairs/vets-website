import React from 'react';
import {
  addressSchema,
  addressUI,
  titleUI,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const titles = {
  married: 'Spouse’s address and phone number',
  separated: 'Spouse’s address and phone number',
  divorced: 'Previous Spouse’s address and phone number',
};

/** @type {PageSchema} */
export default {
  title: 'Spouse’s address and phone number',
  path: 'spouse-contact-information',
  uiSchema: {
    ...titleUI(({ formData }) => {
      const statusKey = formData?.maritalStatus?.toLowerCase();
      const title = titles[statusKey] || 'Spouse’s address and phone number';

      return (
        <>
          <h3>{title}</h3>
        </>
      );
    }),
    spouseAddress: addressUI({
      labels: {
        militaryCheckbox:
          'My spouse lives on a U.S. military base outside of the United States.',
      },
    }),
    spousePhone: phoneUI('Phone number'),
  },
  schema: {
    type: 'object',
    properties: {
      spouseAddress: addressSchema(),
      spousePhone: {
        type: 'string',
        pattern: '^[\\d\\-+\\s()]*$',
      },
    },
  },
};
