import React from 'react';
import PropTypes from 'prop-types';

import { MISSING_CONTACT_INFO } from '@@vap-svc/constants';
import MissingContactInfoAlertLink from './MissingContactInfoAlertLink';

const missingMobilePhoneContent = (
  <>
    <p>
      To manage settings for text message notifications, first add a mobile
      phone number to your profile.
    </p>
    <p>
      <MissingContactInfoAlertLink missingInfo={MISSING_CONTACT_INFO.MOBILE} />
    </p>
  </>
);

const missingAllContactInfoContent = (
  <>
    <p>
      To get started managing your notification settings, add an email address
      or phone number to your profile.{' '}
    </p>

    <p>
      <MissingContactInfoAlertLink missingInfo={MISSING_CONTACT_INFO.EMAIL} />
    </p>

    <p>
      <MissingContactInfoAlertLink missingInfo={MISSING_CONTACT_INFO.MOBILE} />
    </p>
  </>
);

export const getAlertData = ({
  missingEmailAddress,
  missingMobilePhone,
  showEmailNotificationSettings,
}) => {
  if (
    missingEmailAddress &&
    missingMobilePhone &&
    showEmailNotificationSettings
  ) {
    return {
      content: missingAllContactInfoContent,
      title: 'We don’t have your contact information',
    };
  }
  if (missingMobilePhone && !showEmailNotificationSettings) {
    return {
      content: missingMobilePhoneContent,
      title: 'We don’t have your mobile phone number',
    };
  }
  return { content: null, title: null };
};

const MissingContactInfoAlert = ({
  missingMobilePhone,
  missingEmailAddress,
  showEmailNotificationSettings,
}) => {
  const { content, title } = getAlertData({
    missingEmailAddress,
    missingMobilePhone,
    showEmailNotificationSettings,
  });

  if (content) {
    return (
      <div data-testid="missing-contact-info-alert">
        <va-alert status="warning" uswds>
          <h2 slot="headline">{title}</h2>
          {content}
        </va-alert>
      </div>
    );
  }

  return null;
};

MissingContactInfoAlert.propTypes = {
  missingEmailAddress: PropTypes.bool,
  missingMobilePhone: PropTypes.bool,
  showEmailNotificationSettings: PropTypes.bool,
};

export default MissingContactInfoAlert;
