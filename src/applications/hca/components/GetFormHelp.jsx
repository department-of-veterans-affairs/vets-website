import React from 'react';

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
        <a className="help-phone-number-link" href="tel:1-800-877-8339">
          800-877-8339
        </a>
        <br />
        Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. ET
      </p>
    </div>
  );
}

export default GetFormHelp;
