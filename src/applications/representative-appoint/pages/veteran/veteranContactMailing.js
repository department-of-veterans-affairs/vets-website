import React from 'react';

import {
  addressSchema,
  addressUI,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ProfileNotUpdatedNote from '../../components/ProfileNotUpdatedNote';
import { preparerIsVeteran } from '../../utilities/helpers';

export const uiSchema = {
  ...titleUI('Your mailing address'),
  profileNotUpdatedNote: {
    'ui:description': formData => (
      <ProfileNotUpdatedNote
        includeLink
        includePrefix
        preparerIsVeteran={preparerIsVeteran({ formData })}
      />
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
    veteranHomeAddress: addressSchema({
      omit: ['street3'],
    }),
  },
};
