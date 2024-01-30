import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import {
  fullNameUI,
  ssnUI,
  dateOfBirthUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import ApplicantDescription from '../../../components/ApplicantDescription';
import { generateTitle, generateHelpText } from '../../../utils/helpers';

const {
  claimantFullName,
  claimantSocialSecurityNumber,
  claimantDateOfBirth,
} = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Personal information'),
    'ui:description': formContext => (
      <>
        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          uswds
          visible
        >
          <p className="vads-u-margin-y--0">
            We’ve prefilled some of your information from your account. If you
            need to correct anything, you can edit the form fields below.
          </p>
        </va-alert>
        <ApplicantDescription formContext={formContext} />
      </>
    ),
    claimantFullName: {
      ...fullNameUI(),
      first: {
        'ui:title': 'Your first name',
        'ui:errorMessages': {
          required: 'Enter your first name',
        },
      },
      middle: {
        'ui:title': 'Your middle name',
      },
      last: {
        'ui:title': 'Your last name',
        'ui:errorMessages': {
          required: 'Enter your last name',
        },
      },
      suffix: {
        'ui:title': 'Your suffix',
      },
    },
    claimantSocialSecurityNumber: {
      ...ssnUI(),
      'ui:title': 'Your Social Security number',
      'ui:description': generateHelpText('example, 123 45 6789'),
      'ui:errorMessages': {
        required: 'Enter your Social Security number',
      },
    },
    claimantDateOfBirth: {
      ...dateOfBirthUI(),
      'ui:title': 'Your date if birth',
      'ui:errorMessages': {
        required: 'Enter your date of birth',
        pattern: 'Enter a valid date',
      },
    },
  },
  schema: {
    type: 'object',
    required: [
      'claimantFullName',
      'claimantSocialSecurityNumber',
      'claimantDateOfBirth',
    ],
    properties: {
      claimantFullName,
      claimantSocialSecurityNumber,
      claimantDateOfBirth,
    },
  },
};
