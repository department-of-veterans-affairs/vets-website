import React from 'react';
import { Link } from 'react-router-dom';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { getContactInfoDeepLinkURL } from '@@profile/helpers';
import { FIELD_NAMES } from '@@vap-svc/constants';

const ContactInfoOnFile = ({ emailAddress, mobilePhoneNumber }) => {
  return (
    <>
      <p className="vads-u-margin-bottom--0">
        We’ll use the contact information from your profile to send you the
        notifications you choose:
      </p>
      <ul className="vads-u-margin-y--3">
        {emailAddress ? (
          <li className="vads-u-margin-y--0p5">
            {emailAddress}{' '}
            <Link to={getContactInfoDeepLinkURL(FIELD_NAMES.EMAIL, true)}>
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
              to={getContactInfoDeepLinkURL(FIELD_NAMES.MOBILE_PHONE, true)}
            >
              Update mobile phone
            </Link>
          </li>
        ) : null}
      </ul>
      <hr aria-hidden="true" />
    </>
  );
};

export default ContactInfoOnFile;
