import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const NotInMPIError = () => {
  const content = (
    <>
      <p>
        We’re sorry. We can’t give you access to your profile or account
        information until we can match your information and verify your
        identity.
      </p>
      <p>
        If you’d like to access these tools, please contact the VA.gov help desk
        at <Telephone contact={CONTACTS.VA_311} /> (TTY:{' '}
        <Telephone contact={CONTACTS['711']} />) to verify and update your
        records.
      </p>
    </>
  );

  return (
    <div className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4">
      <AlertBox
        headline="We can’t match your information to our Veteran records"
        content={content}
        status="warning"
      />
    </div>
  );
};

export default NotInMPIError;
