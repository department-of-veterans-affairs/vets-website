import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import moment from 'moment';

export const ErrorMessage = () => (
  <div
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
        about a debt that has been resolved, call the Debt Management Center at{' '}
        <Telephone contact="8008270648" />
        {'.'}
      </p>
    </div>
  </div>
);

export const DowntimeMessage = () => {
  return (
    <AlertBox headline="Nightly tool maintenance" isVisible status="error">
      <p>
        We’re working on this tool right now. If you have trouble signing in or
        using this tool, check back after we’re finished.
      </p>
      <p>
        Please note that we'll be doing maintenance at this time each night from
        12:30 a.m. to 3 a.m. ET. Thank you for your patience.
      </p>
      <p>Date: {moment(Date.now()).format('dddd, MMMM D, YYYY')}</p>
      <p>Start/End time: 12:30 a.m. to 3:00 a.m. ET</p>
      <h4>What can you do</h4>
      <p>
        You can still{' '}
        <a href="/manage-va-debt/your-debt/debt-letters">
          Download your debt letters.
        </a>{' '}
        If you need help resolving a debt, or you would like to get information
        about a debt that has been resolved, call the Debt Management Center at{' '}
        <Telephone contact="8008270648" />.
      </p>
    </AlertBox>
  );
};
