import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export default function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        Call the National Cemetery Scheduling Office at{' '}
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-telephone-component */}
        <a href="tel:+18005351117" aria-label="8 0 0. 5 3 5. 1 1 1 7.">
          800-535-1117
        </a>{' '}
        (TTY: <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
        ), and select option 4. We’re here Monday through Friday, 8:00 a.m. to
        5:30 p.m. ET.
      </p>
      <p className="help-talk">
        For benefit-related questions, call VA Benefits and Services at{' '}
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-telephone-component */}
        <a href="tel:+18008271000" aria-label="8 0 0. 8 2 7. 1 0 0 0.">
          800-827-1000
        </a>{' '}
        (TTY: <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
        ). We’re here Monday through Friday, 8:00 a.m. to 7:30 p.m. ET.
      </p>
    </div>
  );
}
