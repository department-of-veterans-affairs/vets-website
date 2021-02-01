import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const GetFormHelp = () => (
  <p className="help-talk">
    For help filling out this form, or if the form isn't working right, please
    call VA Benefits and Services at{' '}
    <Telephone contact={CONTACTS.VA_BENEFITS} />.<br />
    If you have hearing loss, call TTY:{' '}
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['3_DIGIT']} />.
  </p>
);

export default GetFormHelp;
