import React from 'react';

import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ProfileNotUpdatedNote from '../../components/ProfileNotUpdatedNote';

export const uiSchema = {
  ...titleUI(
    'Your mailing address',
    'We’ll send any important information about your form to this address.',
  ),
  profileNotUpdatedNote: {
    'ui:description': formData => (
      <ProfileNotUpdatedNote formData={formData} includePrefix includeLink />
    ),
  },
  homeAddress: addressUI({
    labels: {
      militaryCheckbox: `This address is on a United States military base outside of the U.S.`,
    },
  }),
};

export const schema = {
  type: 'object',
  properties: {
    profileNotUpdatedNote: { type: 'object', properties: {} },
    homeAddress: addressSchema({
      omit: ['street3'],
    }),
  },
};
