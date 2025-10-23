import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <>
    <p className="vads-u-margin--0 vads-u-margin-bottom--5">
      You can call us at{' '}
      <va-telephone contact={CONTACTS.VA_411} extension={0} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here 24/7.
    </p>
  </>
);

export default GetFormHelp;
