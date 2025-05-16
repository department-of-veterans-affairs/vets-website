import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const ErrorMessage = () => {
  return (
    <div className="vads-u-margin-bottom--9">
      <h2 className="vads-u-margin--0">
        We can’t give you access to this page
      </h2>
      <p>
        If you typed or copied the URL into your web browser, check that it’s
        correct.
      </p>
      <p>
        If you think you should have access, call us at{' '}
        <va-telephone contact={CONTACTS.MY_HEALTHEVET} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </div>
  );
};

export default ErrorMessage;
