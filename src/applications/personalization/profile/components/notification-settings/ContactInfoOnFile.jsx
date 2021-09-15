import React from 'react';
import { Link } from 'react-router-dom';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { PROFILE_PATHS } from '@@profile/constants';
import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';

const ContactInfoOnFile = ({ emailAddress, mobilePhoneNumber }) => {
  return (
    <>
      <p>
        We’ll use the contact information from your profile to send you the
        notifications you choose:
      </p>
      <ul>
        {emailAddress ? (
          <li className="vads-u-margin-y--0p5">
            {emailAddress}{' '}
            <Link
              to={`${PROFILE_PATHS.PERSONAL_INFORMATION}#edit-${
                FIELD_IDS[FIELD_NAMES.EMAIL]
              }`}
            >
              Update email
            </Link>
          </li>
        ) : null}
        {mobilePhoneNumber ? (
          <li className="vads-u-margin-y--0p5">
            <Telephone
              contact={`${mobilePhoneNumber.areaCode}${
                mobilePhoneNumber.phoneNumber
              }`}
              notClickable
            />{' '}
            <Link
              to={`${PROFILE_PATHS.PERSONAL_INFORMATION}#edit-${
                FIELD_IDS[FIELD_NAMES.MOBILE_PHONE]
              }`}
            >
              Update mobile phone
            </Link>
          </li>
        ) : null}
      </ul>
      <hr />
    </>
  );
};

export default ContactInfoOnFile;
