import React from 'react';

import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import AddContactInfoLink, {
  MISSING_CONTACT_INFO,
} from './MissingContactInfoAlertLink';

const missingEmailAddressContent = (
  <>
    <p>
      To manage settings for email notifications, first add an email address to
      your profile.
    </p>
    <p>
      <AddContactInfoLink strong missingInfo={MISSING_CONTACT_INFO.EMAIL} />
    </p>
  </>
);
const missingMobilePhoneContent = (
  <>
    <p>
      To manage settings for text message notifications, first add a mobile
      phone number to your profile.
    </p>
    <p>
      <AddContactInfoLink strong missingInfo={MISSING_CONTACT_INFO.MOBILE} />
    </p>
  </>
);
const missingAllContactInfoContent = (
  <>
    <p>
      We don’t have your contact email address or mobile phone number. To manage
      your notification settings, first update your contact information.{' '}
    </p>
    <p>
      <AddContactInfoLink strong missingInfo={MISSING_CONTACT_INFO.ALL} />
    </p>
  </>
);

const MissingContactInfoAlert = ({
  missingMobilePhone,
  missingEmailAddress,
}) => {
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
    [missingEmailAddress, missingMobilePhone],
  );

  const alertTitle = React.useMemo(
    () => {
      if (missingEmailAddress && missingMobilePhone) {
        return 'We don’t have your contact information';
      } else if (missingEmailAddress) {
        return 'We don’t have your email address';
      } else if (missingMobilePhone) {
        return 'We don’t have your mobile phone number';
      } else {
        return null;
      }
    },
    [missingEmailAddress, missingMobilePhone],
  );

  if (alertContents) {
    return (
      <div data-testid="missing-contact-info-alert">
        <AlertBox status={ALERT_TYPE.WARNING} headline={alertTitle} level={2}>
          {alertContents}
        </AlertBox>
      </div>
    );
  }

  return null;
};

export default MissingContactInfoAlert;
