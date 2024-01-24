import React from 'react';
import manifest from '../manifest.json';

export const BASE_URL = `${manifest.rootUrl}/`;
export const BENEFITS_PROFILE_URL_SEGMENT = 'benefits-profile';
export const VERIFICATION_PROFILE_URL = BASE_URL;
export const VERIFICATION_RELATIVE_URL = `/`;

export const BENEFITS_PROFILE_URL = `${VERIFICATION_PROFILE_URL}${BENEFITS_PROFILE_URL_SEGMENT}/`;
export const BENEFITS_PROFILE_RELATIVE_URL = `${VERIFICATION_RELATIVE_URL}${BENEFITS_PROFILE_URL_SEGMENT}/`;

export const CHANGE_OF_DIRECT_DEPOSIT_TITLE = 'Direct deposit information';
export const DIRECT_DEPOSIT_BUTTON_TEXT = 'Add or update account';
export const CHANGE_OF_ADDRESS_TITLE = 'Contact information';
export const PAYEE_INFO_TITLE = 'Payee information';
export const ADDRESS_BUTTON_TEXT = 'Edit';
export const SMALL_SCREEN = 481;
export const ENROLLMETS_PER_PAGE = 6;
export const howToChangeLegalNameInfoLink =
  'https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/';

// add field title to make it a required field for the change of address form
export const addressFormRequiredData = [
  'countryCodeIso3',
  'addressLine1',
  'city',
  'stateCode',
];

// Regex that uses a negative lookahead to check that a string does NOT contain
// things like `http`, `www.`, or a few common TLDs.
export const blockURLsRegEx =
  '^((?!http|www\\.|\\.co|\\.net|\\.gov|\\.edu|\\.org).)*$';

// export const STREET_LINE_MAX_LENGTH = 20;

export const ACTIVEDUTYBENEFITSSTATEMENT = (
  <p>
    Your benefits are not yet set to expire because you are still on active
    duty. Benefits end 10 years from the date of your last discharge or release
    from active duty.
  </p>
);
