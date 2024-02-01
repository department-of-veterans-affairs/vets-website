import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { FIELD_NAMES } from '@@vap-svc/constants';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { useContactInfoDeepLink } from '../../hooks';
import { PROFILE_PATHS } from '../../constants';

const ContactInfoOnFile = ({
  emailAddress,
  mobilePhoneNumber,
  showEmailNotificationSettings,
}) => {
  const { generateContactInfoLink } = useContactInfoDeepLink();
  return (
    <>
      <p className="vads-u-margin-bottom--0">
        We’ll use the contact information from your profile to send you the
        notifications you choose:
      </p>
      <ul className="vads-u-margin-y--3">
        {showEmailNotificationSettings ? (
          <li className="vads-u-margin-y--0p5">
            <strong>Email address: </strong>
            {emailAddress && `${emailAddress} `}
            <Link
              to={generateContactInfoLink({
                fieldName: FIELD_NAMES.EMAIL,
                returnPath: encodeURIComponent(
                  PROFILE_PATHS.NOTIFICATION_SETTINGS,
                ),
              })}
              className="vads-u-display--block medium-screen:vads-u-display--inline vads-u-margin-bottom--1p5 medium-screen:vads-u-margin-bottom--0 medium-screen:vads-u-margin-left--1"
            >
              {emailAddress
                ? 'Update your email address'
                : 'Add your email address to your profile'}
            </Link>
          </li>
        ) : null}

        <li className="vads-u-margin-y--0p5">
          <strong>Mobile phone: </strong>
          {mobilePhoneNumber && (
            <VaTelephone
              data-testid="mobile-phone-number-on-file"
              contact={`${mobilePhoneNumber.areaCode}${
                mobilePhoneNumber.phoneNumber
              }`}
              notClickable
            />
          )}
          <va-link
            href={generateContactInfoLink({
              fieldName: FIELD_NAMES.MOBILE_PHONE,
              returnPath: encodeURIComponent(
                PROFILE_PATHS.NOTIFICATION_SETTINGS,
              ),
            })}
            class="vads-u-display--block medium-screen:vads-u-display--inline medium-screen:vads-u-margin-left--1"
            aria-label="mobile number"
            text={
              mobilePhoneNumber
                ? 'Update your mobile phone number'
                : 'Add your mobile phone number to your profile'
            }
          />
        </li>
      </ul>
    </>
  );
};

ContactInfoOnFile.propTypes = {
  emailAddress: PropTypes.string,
  mobilePhoneNumber: PropTypes.shape({
    areaCode: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
  showEmailNotificationSettings: PropTypes.bool,
};

export default ContactInfoOnFile;
