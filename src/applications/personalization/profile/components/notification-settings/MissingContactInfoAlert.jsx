import React from 'react';
import PropTypes from 'prop-types';

import { MISSING_CONTACT_INFO } from '@@vap-svc/constants';
import MissingContactInfoAlertLink from './MissingContactInfoAlertLink';

const missingEmailAddressContent = (
  <>
    <p>
      To manage settings for email notifications, first add an email address to
      your profile.
    </p>
    <p>
      <MissingContactInfoAlertLink missingInfo={MISSING_CONTACT_INFO.EMAIL} />
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
      <MissingContactInfoAlertLink missingInfo={MISSING_CONTACT_INFO.MOBILE} />
    </p>
  </>
);

export const getAlertData = ({ missingEmailAddress, missingMobilePhone }) => {
  if (missingEmailAddress && missingMobilePhone) {
    return {
      content: missingMobilePhoneContent,
      title: 'We don’t have your mobile phone number',
    };
    // TODO: uncomment when email is a supported communication channel
    // return missingAllContactInfoContent;
  }
  if (missingEmailAddress) {
    return {
      content: missingEmailAddressContent,
      title: 'We don’t have your email address',
    };
  }
  if (missingMobilePhone) {
    return {
      content: missingMobilePhoneContent,
      title: 'We don’t have your mobile phone number',
    };
  }
  return { content: null, title: null };
};
// TODO: uncomment when email is a supported communication channel
// const missingAllContactInfoContent = (
//   <>
//     <p>
//       We don’t have your contact email address or mobile phone number. To manage
//       your notification settings, first update your contact information.{' '}
//     </p>
//     <p>
//       <AddContactInfoLink missingInfo={MISSING_CONTACT_INFO.ALL} />
//     </p>
//   </>
// );

const MissingContactInfoAlert = ({
  missingMobilePhone,
  missingEmailAddress,
}) => {
  const { content, title } = getAlertData({
    missingEmailAddress,
    missingMobilePhone,
  });

  if (content) {
    return (
      <div data-testid="missing-contact-info-alert">
        <va-alert status="warning">
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
};

export default MissingContactInfoAlert;
