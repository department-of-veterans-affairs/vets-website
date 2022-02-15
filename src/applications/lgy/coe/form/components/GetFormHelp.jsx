import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export const GetFormHelp = () => (
  <p className="help-talk">
    If you need help or have questions about your eligibility, call us at{' '}
    <Telephone contact="877-827-3702" />. TTY:{' '}
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['3_DIGIT']} />. We’re
    here Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.
  </p>
);
