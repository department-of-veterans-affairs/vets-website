import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getContactInfoDeepLinkURL } from '@@profile/helpers';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useContactInfoDeepLink } from '../../hooks';
import { PROFILE_PATHS } from '../../constants';

const ContactInfoOnFile = ({ emailAddress, mobilePhoneNumber }) => {
  const { generateContactInfoLink } = useContactInfoDeepLink();
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
            <strong>Mobile phone: </strong>
            <VaTelephone
              data-testid="mobile-phone-number-on-file"
              contact={`${mobilePhoneNumber.areaCode}${
                mobilePhoneNumber.phoneNumber
              }`}
              notClickable
            />{' '}
            <Link
              to={generateContactInfoLink({
                fieldName: FIELD_NAMES.MOBILE_PHONE,
                focusOnEditButton: true,
                returnPath: encodeURIComponent(
                  PROFILE_PATHS.NOTIFICATION_SETTINGS,
                ),
              })}
              className="small-screen:vads-u-display--block medium-screen:vads-u-display--inline"
              aria-label="mobile number"
            >
              Update
            </Link>
          </li>
        ) : null}
      </ul>
      <hr aria-hidden="true" />
    </>
  );
};

ContactInfoOnFile.propTypes = {
  emailAddress: PropTypes.string,
  mobilePhoneNumber: PropTypes.shape({
    areaCode: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
};

export default ContactInfoOnFile;
