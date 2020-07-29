import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export default function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">Enrollment or Eligibility questions:</p>
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
