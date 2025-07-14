import React from 'react';
import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';
// import profileContactInfo from 'applications/_mock-form-ae-design-patterns/shared/components/ContactInfo/profileContactInfo';

// Content for the contact information page using VA standards
const content = {
  ...getContent('dispute'),
  title: 'Contact information',
  description: (
    <div className="vads-u-margin-y--2">
      <va-alert status="info" background-only>
        <p className="vads-u-margin-y--0">
          <strong>Note:</strong> Since you’re signed in to your account, we can
          prefill part of your application based on your account details. You
          can also save your application in progress and come back later to
          finish filling it out.
        </p>
      </va-alert>

      <p>
        This is the contact information we have on file for you. We’ll send any
        important information about your debt to this address.
      </p>
      <p>
        <strong>Note:</strong> Any updates you make here will be reflected in
        your VA.gov profile.
      </p>
    </div>
  ),
  // Standard field content
  edit: 'Edit',
  editLabel: 'Edit contact information',
  updated: 'has been updated',
  alertSaved: 'has been saved',
  mailingAddress: 'Current Mailing address',
  editMailingAddress: 'Edit mailing address',
  mobilePhone: 'Phone number',
  editMobilePhone: 'Edit phone number',
  email: 'Email address',
  editEmail: 'Edit email address',
  // Additional content for validation and review
  missingHomeOrMobile: 'phone number',
  missingMobilePhone: 'phone number',
  missingAddress: 'mailing address',
  missingEmail: 'email address',
  missingEmailError: 'Missing email address',
  // Review & submit field labels
  address1: 'Street address',
  address2: 'Street address line 2',
  address3: 'Street address line 3',
  city: 'City',
  state: 'State',
  province: 'Province',
  postal: 'Postal code',
  country: 'Country',
};

export default profileContactInfo({
  content,
  contactPath: 'contact-information',
  contactInfoPageKey: 'contact-information',
  included: ['mailingAddress', 'mobilePhone', 'email'], // Order: 1. Address, 2. Phone, 3. Email
  contactInfoRequiredKeys: ['mailingAddress', 'mobilePhone', 'email'],
  wrapperKey: 'veteran',
  mobilePhoneKey: 'mobilePhone',
  emailKey: 'email',
  addressKey: 'mailingAddress',
  disableMockContactInfo: false,
  contactSectionHeadingLevel: 'h2',
  editContactInfoHeadingLevel: 'h2',
  prefillPatternEnabled: true,
  depends: () => true,
  contactInfoUiSchema: {
    'ui:options': {
      showTitle: true,
    },
  },
});
