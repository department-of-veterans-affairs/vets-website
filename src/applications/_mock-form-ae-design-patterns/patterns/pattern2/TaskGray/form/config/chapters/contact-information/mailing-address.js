import React from 'react';
import addressUiSchema, {
  updateFormDataAddress,
} from 'platform/forms-system/src/js/definitions/profileAddress';

import { contactInformation } from '../../schemaImports';

const description = () => (
  <>
    <p>We’ll send any updates about your request to this address.</p>
    <p>
      If you notice any errors, correct them now. Any updates you make will
      change the information on this request only. If you need to update your
      address with VA, go to your profile to make any changes. <br />
      <a href="/profile/contact-information#addresses">
        Update your address in your profile
      </a>
    </p>
  </>
);

export const title = 'Mailing address';

const checkboxTitle = 'I live on a U.S. military base outside of the country';

export const schema = contactInformation.mailingAddress;

export const uiSchema = {
  'ui:description': description,
  applicantAddress: addressUiSchema(
    'applicantAddress',
    checkboxTitle,
    () => true,
    {},
    true,
  ),
};

export const updateFormData = (oldFormData, formData) =>
  updateFormDataAddress(oldFormData, formData, 'applicantAddress');
