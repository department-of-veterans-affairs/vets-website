import React from 'react';
import moment from 'moment';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export const ErrorMessage = () => (
  <section
    className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
    role="alert"
  >
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        Information about your current debts is unavailable.
      </h3>
      <p className="vads-u-font-family--sans">
        You can't view information about your current debts because something
        went wrong on our end.
      </p>
      <h4>What you can do</h4>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        You're still able to download your debt letters from the list below. If
        you need help resolving a debt, or you would like to get information
        about a debt that has been resolved, call the Debt Management Center at
        <Telephone className="vads-u-margin-left--0p5" contact="8008270648" />.
      </p>
    </div>
  </section>
);

export const DowntimeMessage = () => {
  return (
    <va-alert status="error" class="vads-u-margin-bottom--4">
      <h3 slot="headline">Nightly tool maintenance</h3>

      <p className="vads-u-font-size--base vads-u-font-family--sans">
        We’re working on this tool right now. If you have trouble signing in or
        using this tool, check back after we’re finished.
      </p>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        Please note that we'll be doing maintenance at this time each night from
        12:30 a.m. to 3 a.m. ET. Thank you for your patience.
      </p>

      <p className="vads-u-font-size--base vads-u-font-family--sans">
        Date: {moment(Date.now()).format('dddd, MMMM D, YYYY')}
      </p>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        Start/End time: 12:30 a.m. to 3:00 a.m. ET
      </p>

      <h4>What can you do</h4>

      <p className="vads-u-font-size--base vads-u-font-family--sans">
        You can still
        <a
          href="/manage-va-debt/your-debt/debt-letters"
          className="vads-u-margin-x--0p5"
        >
          download your debt letters.
        </a>
        If you need help resolving a debt, or you would like to get information
        about a debt that has been resolved, call the Debt Management Center at
        <Telephone className="vads-u-margin-left--0p5" contact="8008270648" />.
      </p>
    </va-alert>
  );
};
