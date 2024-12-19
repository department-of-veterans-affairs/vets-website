import React from 'react';

import {
  addressSchema,
  addressUI,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ProfileNotUpdatedNote from '../../components/ProfileNotUpdatedNote';

export const uiSchema = {
  ...titleUI('Your mailing address'),
  profileNotUpdatedNote: {
    'ui:description': formData => (
      <ProfileNotUpdatedNote formData={formData} includePrefix includeLink />
    ),
  },
  veteranHomeAddress: addressUI({
    labels: {
      militaryCheckbox: `This address is on a United States military base outside of the U.S.`,
    },
  }),
};

export const schema = {
  type: 'object',
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    veteranHomeAddress: {
      ...addressSchema({ omit: ['street3'] }),
      properties: {
        ...addressSchema({ omit: ['street3'] }).properties,
        street: {
          type: 'string',
          maxLength: 30,
          minLength: 1,
          pattern: '^.*\\S.*',
        },
        street2: {
          type: 'string',
          maxLength: 5,
        },
        city: {
          type: 'string',
          maxLength: 18,
          minLength: 1,
          pattern: '^.*\\S.*',
        },
        state: {
          type: 'string',
          maxLength: 2,
        },
        postalCode: {
          type: 'string',
          maxLength: 9,
          pattern: '^[0-9]{5}(?:-[0-9]{4})?$',
        },
      },
    },
  },
};
