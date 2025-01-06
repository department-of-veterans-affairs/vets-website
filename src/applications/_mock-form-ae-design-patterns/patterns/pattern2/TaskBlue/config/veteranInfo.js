import React from 'react';
import { PersonalInformation } from '~/platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';

/**
 * @type {PersonalInformationConfig}
 */
const config = {
  showSSN: true,
  showVAFileNumber: true,
  showDateOfBirth: true,
  showGender: false,
  showName: true,
  errorMessage: 'Required information is missing.',
};

export const veteranInformation = {
  uiSchema: {
    'ui:description': props => (
      <PersonalInformation config={config} {...props} />
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
