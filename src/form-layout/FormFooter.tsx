import React from 'react';

export default function FormFooter() {
  // Render default form footer content
  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <div className="help-footer-box">
          <h2 className="help-heading">Need help?</h2>

          <div>
            <p className="help-talk">
              Call us at{' '}
              <a href="tel:+18008271000" aria-label="8 0 0. 8 2 7. 1 0 0 0.">
                800-827-1000
              </a>
              . We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If
              you have hearing loss, call TTY:{' '}
              <a href="tel:711" aria-label="TTY. 7 1 1.">
                711
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
