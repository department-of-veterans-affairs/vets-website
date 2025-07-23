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

  const updateMobileNumberHref = generateContactInfoLink({
    fieldName: FIELD_NAMES.MOBILE_PHONE,
    returnPath: encodeURIComponent(PROFILE_PATHS.NOTIFICATION_SETTINGS),
  });

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
              data-testid="email-address-on-file"
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
              countryCode={mobilePhoneNumber.countryCode}
              notClickable
            />
          )}
          <va-link
            href={updateMobileNumberHref}
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

      {mobilePhoneNumber &&
        mobilePhoneNumber.isInternational && (
          <va-alert-expandable
            status="info"
            trigger="You won’t receive text notifications"
            class="vads-u-margin-top--2"
          >
            <p className="vads-u-padding-bottom--2">
              You have an international phone number, update to a US based
              mobile phone number to have access to these text notifications
              settings:
            </p>
            <ul className="vads-u-padding-bottom--2">
              <li>Health appointment reminders</li>
              <li>Prescription shipping notifications</li>
              <li>Appeal status updates</li>
              <li>Appeal hearing reminders</li>
              <li>Disability and pension deposit notifications</li>
            </ul>
            <p>
              <va-link
                href={updateMobileNumberHref}
                text="Update your mobile phone number"
              />
            </p>
          </va-alert-expandable>
        )}
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
