import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const Ineligible = () => {
  return (
    <>
      <p className="vads-u-margin-top--0" data-testid="ineligible-text">
        Our records show that you don’t receive benefit payments from VA.
      </p>
      <p className="vads-u-margin-top--0 vads-u-padding-bottom--2 text-balance">
        <strong>
          If you think this is an error, or think you have been a victim of bank
          fraud
        </strong>
        , call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
};
