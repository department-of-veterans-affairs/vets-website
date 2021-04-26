import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const NotInMPIError = () => {
  const content = (
    <>
      <p>
        We can’t give you access to VA.gov tools to manage your health and
        benefits right now. We’ll need to match your information and verify your
        identity first.
      </p>
      <p>
        If you’d like to access these tools on VA.gov, please contact the VA
        help desk at <Telephone contact={CONTACTS.VA_311} /> (TTY:{' '}
        <Telephone contact={CONTACTS['711']} />) to verify and update your
        records.
      </p>
    </>
  );

  return (
    <AlertBox
      headline="We can’t match your information to our records"
      content={content}
      status="warning"
    />
  );
};

export default NotInMPIError;
