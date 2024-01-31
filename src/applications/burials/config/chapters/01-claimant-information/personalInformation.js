import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import {
  fullNameUI,
  ssnUI,
  dateOfBirthUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import ApplicantDescription from '../../../components/ApplicantDescription';
import { generateTitle } from '../../../utils/helpers';

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
    claimantFullName: fullNameUI(title => `Your ${title}`),
    claimantSocialSecurityNumber: ssnUI('Your Social Security number'),
    claimantDateOfBirth: dateOfBirthUI('Your date of birth'),
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
