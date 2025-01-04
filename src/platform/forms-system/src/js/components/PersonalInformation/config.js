import React from 'react';
import PersonalInformation from './PersonalInformation';

// Example usage in a form as a veteranInformation page
export const veteranInformation = {
  uiSchema: {
    'ui:description': props => (
      <PersonalInformation
        config={{
          showSSN: true,
          showVAFileNumber: false,
          showDateOfBirth: true,
          showGender: true,
          showName: true,
        }}
        dataAdapter={{
          ssnPath: 'formData.veteran.ssn',
          // other mappings
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
