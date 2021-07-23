import React from 'react';
import { Link } from 'react-router-dom';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { PROFILE_PATHS } from '../../constants';

const MissingContactInfoAlert = ({
  missingMobilePhone,
  missingEmailAddress,
}) => {
  const missingEmailAddressContent = (
    <p>
      To get notifications by email, first{' '}
      <Link to={`${PROFILE_PATHS.PERSONAL_INFORMATION}#edit-email-address`}>
        add your email address to your profile
      </Link>
      .
    </p>
  );
  const missingMobilePhoneContent = (
    <p>
      To get notifications by SMS text message, first{' '}
      <Link
        to={`${PROFILE_PATHS.PERSONAL_INFORMATION}#edit-mobile-phone-number`}
      >
        add your mobile phone number to your profile
      </Link>
      .
    </p>
  );
  const missingAllContactInfoContent = (
    <p>
      We don‘t have an email address or mobile phone number for you. To manage
      notification settings, please{' '}
      <Link to={`${PROFILE_PATHS.PERSONAL_INFORMATION}#mobile-phone-number`}>
        update your contact information
      </Link>
      .
    </p>
  );

  const alertContents = React.useMemo(
    () => {
      if (missingEmailAddress && missingMobilePhone) {
        return missingAllContactInfoContent;
      } else if (missingEmailAddress) {
        return missingEmailAddressContent;
      } else if (missingMobilePhone) {
        return missingMobilePhoneContent;
      } else {
        return null;
      }
    },
    [
      missingEmailAddress,
      missingMobilePhone,
      missingAllContactInfoContent,
      missingEmailAddressContent,
      missingMobilePhoneContent,
    ],
  );

  if (alertContents) {
    return (
      <div data-testid="missing-contact-info-alert">
        <AlertBox status="info" backgroundOnly>
          {alertContents}
        </AlertBox>
      </div>
    );
  }

  return null;
};

export default MissingContactInfoAlert;
