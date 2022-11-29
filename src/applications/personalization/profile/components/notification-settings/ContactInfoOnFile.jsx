import React from 'react';
import { Link } from 'react-router-dom';

import { getContactInfoDeepLinkURL } from '@@profile/helpers';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
            <strong>Mobile number: </strong>
            <VaTelephone
              data-testid="mobile-phone-number-on-file"
              contact={`${mobilePhoneNumber.areaCode}${
                mobilePhoneNumber.phoneNumber
              }`}
              notClickable
            />{' '}
            <Link
              to={getContactInfoDeepLinkURL(FIELD_NAMES.MOBILE_PHONE, true)}
              className="small-screen:vads-u-display--block medium-screen:vads-u-display--inline"
            >
              Update
              <span className="sr-only"> mobile number</span>
            </Link>
          </li>
        ) : null}
      </ul>
      <hr aria-hidden="true" />
    </>
  );
};

export default ContactInfoOnFile;
