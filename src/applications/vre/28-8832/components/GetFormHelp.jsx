import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

const GetFormHelp = () => (
  <p className="help-talk">
    If you have questions or need help filling out this form, please call our
    MYVA411 main information line at <Telephone contact={CONTACTS.VA_311} /> and{' '}
    select 0. We’re here 24/7.
    <br />
    If you have hearing loss, call TTY:{' '}
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
  </p>
);

export default GetFormHelp;
