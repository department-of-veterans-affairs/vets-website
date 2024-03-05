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
  formV2,
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
    claimantFullName: fullNameUI(),
    claimantSocialSecurityNumber: {
      ...ssnUI('Social Security number'),
      'ui:required': form =>
        form?.relationshipToVeteran !== 'executor' &&
        form?.relationshipToVeteran !== 'funeralDirector' &&
        form?.relationshipToVeteran !== 'otherFamily',
    },
    claimantDateOfBirth: {
      ...dateOfBirthUI('Date of birth'),
      'ui:required': form =>
        form?.relationshipToVeteran !== 'executor' &&
        form?.relationshipToVeteran !== 'funeralDirector' &&
        form?.relationshipToVeteran !== 'otherFamily',
    },

    // <------ Needed for version control on the backend ------>
    // TODO: Once Burials V2 is 100% rolled out, we can remove this and remove the def from vets-json-schema
    formV2: {
      'ui:title': 'Form version 2',
      'ui:widget': <div className="vads-u-display--none" />,
      'ui:reviewField': () => <div className="vads-u-display--none" />,
      'ui:options': {
        classNames: 'vads-u-display--none',
      },
    },
    // <-------------------------------------------------------->
  },
  schema: {
    type: 'object',
    required: ['claimantFullName'],
    properties: {
      claimantFullName,
      claimantSocialSecurityNumber,
      claimantDateOfBirth,
      formV2,
    },
  },
};
