import React from 'react';
import { PersonalInformation } from '~/platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';

export const veteranInformation = {
  uiSchema: {
    'ui:description': props => (
      <PersonalInformation
        config={{
          showSSN: true,
          showVAFileNumber: false,
          showDateOfBirth: true,
          showGender: false,
          showName: true,
          errorMessage: 'Required information is missing.',
        }}
        dataAdapter={{
          ssnPath: 'veteranSocialSecurityNumber',
        }}
        {...props}
      />
    ),
    'ui:options': {
      hideOnReview: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
