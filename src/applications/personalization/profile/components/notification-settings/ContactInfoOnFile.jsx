import React from 'react';
import { Link } from 'react-router-dom';

import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { PROFILE_PATHS } from '@@profile/constants';

const ContactInfoOnFile = ({ emailAddress, mobilePhoneNumber }) => {
  return (
    <>
      <p>
        We’ll use the contact information from your profile to send
        notifications:
      </p>
      {emailAddress ? (
        <p>
          <strong>{emailAddress}</strong>
        </p>
      ) : null}
      {mobilePhoneNumber ? (
        <p>
          <strong>
            <Telephone
              contact={`${mobilePhoneNumber.areaCode}${
                mobilePhoneNumber.phoneNumber
              }`}
              notClickable
            />
          </strong>
        </p>
      ) : null}
      <p>
        <Link to={PROFILE_PATHS.PERSONAL_INFORMATION}>
          Update your contact information
        </Link>
      </p>
      <AdditionalInfo triggerText="Why can’t I get all notifications by email and text?">
        <p>Some info about email and text notifications.</p>
        <p className="vads-u-margin-bottom--0">
          Some more information about email and text notifications.
        </p>
      </AdditionalInfo>
    </>
  );
};

export default ContactInfoOnFile;
