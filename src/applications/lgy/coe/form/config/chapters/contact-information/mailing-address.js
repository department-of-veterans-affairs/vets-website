import React from 'react';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';

import { applicantContactInformation } from '../../schemaImports';

const description = () => (
  <>
    <p>We’ll send any updates about your request to this address.</p>
    <p>
      If you notice any errors, please correct them now. Any updates you make
      will change the information on this request only. If you need to update
      your address with VA, please go to your profile to make any changes.{' '}
      <br />
      <a href="/profile/contact-information#addresses">
        Update your address in your profile
      </a>
    </p>
  </>
);

export const title = 'Mailing address';

const checkboxTitle = 'I live on a U.S. military base outside of the country';

// NOTE: This will be removed once the schema in vets-json-schema is updated
delete applicantContactInformation.properties.email;
delete applicantContactInformation.properties.phoneNumber;

export const schema = {
  type: 'object',
  title,
  properties: {
    ...applicantContactInformation.properties,
  },
};

export const uiSchema = {
  'ui:description': description,
  applicantAddress: addressUiSchema(
    'applicantAddress',
    checkboxTitle,
    () => true,
  ),
};
