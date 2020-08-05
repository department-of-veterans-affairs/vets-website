import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

const GetFormHelp = () => (
  <p className="help-talk">
    Need help filling out the form or have questions about eligibility? Please
    call VA Benefits and Services at{' '}
    <a className="nowrap" href="tel:1-800-827-1000">
      800-827-1000
    </a>
    .<br />
    <br />
    If you have hearing loss, call{' '}
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
  </p>
);

export default GetFormHelp;
