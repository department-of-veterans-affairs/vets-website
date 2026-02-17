import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_NAMES, USA } from '@@vap-svc/constants';

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

  const isInternationalMobile =
    mobilePhoneNumber &&
    mobilePhoneNumber.isInternational &&
    String(mobilePhoneNumber.countryCode) !== USA.COUNTRY_CODE;

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
            {emailAddress}
            <br />
            <va-link
              data-testid="email-address-on-file"
              href={generateContactInfoLink({
                fieldName: FIELD_NAMES.EMAIL,
                returnPath: encodeURIComponent(
                  PROFILE_PATHS.NOTIFICATION_SETTINGS,
                ),
              })}
              text={
                emailAddress
                  ? 'Update your email address'
                  : 'Add your email address to your profile'
              }
            />
          </li>
        ) : null}

        <li className="vads-u-margin-y--0p5">
          <strong>
            {isInternationalMobile
              ? 'International mobile phone: '
              : 'Mobile phone: '}
          </strong>
          {mobilePhoneNumber && (
            <span style={{ whiteSpace: 'nowrap' }}>
              <va-telephone
                data-testid="mobile-phone-number-on-file"
                // For international number areaCode is null
                // and is instead part of phoneNumber
                contact={
                  isInternationalMobile
                    ? mobilePhoneNumber.phoneNumber
                    : `${mobilePhoneNumber.areaCode}${mobilePhoneNumber.phoneNumber}`
                }
                country-code={
                  isInternationalMobile ? mobilePhoneNumber.countryCode : null
                }
                not-clickable
              />
            </span>
          )}
          <br />
          <va-link
            href={updateMobileNumberHref}
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
    countryCode: PropTypes.string,
    isInternational: PropTypes.bool,
    phoneNumber: PropTypes.string,
  }),
  showEmailNotificationSettings: PropTypes.bool,
};

export default ContactInfoOnFile;
