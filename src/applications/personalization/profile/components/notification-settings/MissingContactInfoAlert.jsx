import React from 'react';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import AddContactInfoLink from './AddContactInfoLink';

const missingEmailAddressContent = (
  <p>
    To get notifications by email, first{' '}
    <AddContactInfoLink missingInfo={AddContactInfoLink.EMAIL} />.
  </p>
);
const missingMobilePhoneContent = (
  <p>
    To get notifications by SMS text message, first{' '}
    <AddContactInfoLink missingInfo={AddContactInfoLink.MOBILE} />.
  </p>
);
const missingAllContactInfoContent = (
  <p>
    We don‘t have an email address or mobile phone number for you. To manage
    notification settings, please{' '}
    <AddContactInfoLink missingInfo={AddContactInfoLink.ALL} />.
  </p>
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
