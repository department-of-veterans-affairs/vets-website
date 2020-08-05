import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

const GetFormHelp = () => (
  <p className="help-talk">
    Need help filling out the form or have questions about eligibility? Please
    call VA Benefits and Services at{' '}
    <a
      href="tel:1-800-827-1000"
      aria-label="8 0 0. 8 2 7. 1 0 0 0."
      className="nowrap"
    >
      800-827-1000
    </a>
    .<br />
    <br />
    If you have hearing loss, call{' '}
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
  </p>
);

export default GetFormHelp;
