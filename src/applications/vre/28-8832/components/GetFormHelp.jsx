import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const GetFormHelp = () => (
  <p className="help-talk">
    If you have questions or need help filling out this form, please call our
    <span aria-label="my VA 4 1 1.">MYVA411</span> main information line at{' '}
    <Telephone contact={CONTACTS.VA_311} /> and select 0. We’re here{' '}
    <abbr title="24 hours a day, 7 days a week">24/7</abbr>.<br />
    If you have hearing loss, call TTY:{' '}
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['3_DIGIT']} />.
  </p>
);

export default GetFormHelp;
