import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export default function ConfirmationPage() {
  const GET_HELP_NUMBER = '307-778-7550';
  const TTY_NUMBER = '711';
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <h1>You're now checked in</h1>

      <va-alert status="success">
        <h3 slot="headline">We’ll contact you when your provider is ready.</h3>
        <div>
          <a className="vads-c-action-link--blue" href="#">
            Go to appointment details
          </a>
        </div>
      </va-alert>
      <footer className="row">
        <h2 className="help-heading">Need help?</h2>
        <p>
          If you have questions or need help checking in, please call our
          MyVA411 main information line at{' '}
          <Telephone contact={GET_HELP_NUMBER} /> and select 0. We're here 24/7.
        </p>
        <p>
          If you have hearing loss, call{' '}
          <Telephone contact={TTY_NUMBER}>TTY: {TTY_NUMBER}</Telephone>.
        </p>
      </footer>
    </div>
  );
}
