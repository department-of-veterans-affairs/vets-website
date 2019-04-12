import React from 'react';
import CallHRC from '../../../platform/static-data/CallHRC';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">Enrollment or Eligibility questions:</p>
      <p className="help-phone-number">
        <a className="help-phone-number-link" href="tel:877-222-8387">
          877-222-8387
        </a>
        <br />
        TTY:{' '}
        <a className="help-phone-number-link" href="tel:+18008778339">
          800-877-8339
        </a>
        <br />
        Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. ET
      </p>
      <p className="help-talk">
        If this form isn't working right for you, please <CallHRC />
      </p>
    </div>
  );
}

export default GetFormHelp;
