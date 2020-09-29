import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export default function ReviewFooter() {
  return (
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading">
          Please don’t use this form if you need emergency care
        </h3>
        <div className="usa-alert-text">
          <p>
            <span className="vads-u-font-weight--bold">
              If you think you have a medical emergency,
            </span>{' '}
            call 911 or go to the nearest emergency room.
          </p>
          <section>
            <header className="vads-u-font-weight--bold">
              If you need to talk to someone right away,
            </header>
            <ul>
              <li>
                Call the Veterans Crisis Line at{' '}
                <Telephone contact={CONTACTS.CRISIS_LINE} /> and press 1, or
              </li>
              <li>
                Start a{' '}
                <a href="https://www.veteranscrisisline.net/ChatTermsOfService.aspx?account=Veterans%20Chat/">
                  confidential Veteran chat
                </a>{' '}
                , or
              </li>
              <li>
                Text <a href="sms:838255">838255</a>.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
