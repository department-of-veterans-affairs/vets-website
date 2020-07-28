import React from 'react';

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
        <a
          className="help-phone-number-link"
          href="tel:+18008778339"
          aria-label="8 0 0. 8 7 7. 8 3 3 9."
        >
          800-877-8339
        </a>
        <br />
        Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. ET
      </p>
    </div>
  );
}
