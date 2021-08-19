import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export const GetFormHelp = () => (
  <p className="help-talk">
    Need help applying or have questions about eligibility? Call our toll-free
    number: <Telephone contact={'877-827-3702'} />. If you have hearing loss,
    call TTY:{' '}
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['3_DIGIT']} />. We’re
    here Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.
  </p>
);
