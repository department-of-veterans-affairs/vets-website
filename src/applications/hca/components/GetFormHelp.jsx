import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        Need help enrolling or have questions about enrollment or eligibility?
        Call our toll-free number:
      </p>
      <p className="help-phone-number">
        <a className="help-phone-number-link" href="tel:1-877-222-8387">
          877-222-8387
        </a>
        <br />
        TTY:{' '}
        <Telephone
          className="help-phone-number-link"
          contact={CONTACTS.HELP_TTY}
        />
        <br />
        Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. ET
      </p>
    </div>
  );
}

export default GetFormHelp;
