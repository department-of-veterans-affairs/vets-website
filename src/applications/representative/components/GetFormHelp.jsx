import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <p className="help-talk">
    If you have questions about selecting a representative, please call our
    MYVA411 main information line at: <va-telephone contact={CONTACTS.VA_411} />{' '}
    select 0. We’re here 24/7. If you have hearing loss, call{' '}
    <va-telephone contact={CONTACTS['711']} tty />.
  </p>
);

export default GetFormHelp;
