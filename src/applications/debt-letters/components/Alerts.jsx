import React from 'react';
import moment from 'moment';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const DownloadLettersAlert = () => (
  <va-alert
    class="vads-u-margin-top--4 vads-u-margin-bottom--4"
    status="warning"
  >
    <h3 slot="headline">
      Letters sent after December 9th, 2021 are unavailable for download
    </h3>
    <p className="vads-u-font-size--base vads-u-font-family--sans">
      We’re sorry. Because the letters sent after this date are unavailable for
      download right now, we need to refer you to the letters you receive by
      mail.
    </p>
    <p className="vads-u-font-size--base vads-u-font-family--sans">
      If you have any questions, call us at
      <va-telephone contact="8008270648" className="vads-u-margin-x--0p5" />
      (or
      <va-telephone
        contact="6127136415"
        international
        className="vads-u-margin-x--0p5"
      />
      from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m.
      ET. If you have hearing loss, call
      <va-telephone
        contact={CONTACTS[711]}
        tty
        className="vads-u-margin-left--0p5"
      />
      .
    </p>
    <p className="vads-u-font-size--base vads-u-font-family--sans">
      We’re working to fix this problem as fast as we can. Check back soon for
      updates.
    </p>
  </va-alert>
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
        Please note that we’ll be doing maintenance at this time each night from
        12:30 a.m. to 3 a.m. ET. Thank you for your patience.
      </p>

      <p className="vads-u-font-size--base vads-u-font-family--sans">
        Date: {moment().format('dddd, MMMM D, YYYY')}
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
        <va-telephone
          className="vads-u-margin-left--0p5"
          contact="8008270648"
        />
        .
      </p>
    </va-alert>
  );
};

export const ErrorMessage = () => (
  <va-alert class="vads-u-margin-top--0 vads-u-padding--3" status="error">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        Information about your current debts is unavailable
      </h3>
      <p className="vads-u-font-family--sans">
        We’re sorry. You can’t view information about your current debts because
        something went wrong on our end. Please check back soon.
      </p>
      <h4>What you can do</h4>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        If you continue having trouble viewing information about your current
        debts, contact us online through <a href="https://ask.va.gov">Ask VA</a>
        .
      </p>
    </div>
  </va-alert>
);

export const ErrorAlert = () => (
  <va-alert class="vads-u-margin-top--0 vads-u-padding--3" status="error">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        Your debt letters are currently unavailable.
      </h3>
      <p className="vads-u-font-family--sans">
        You can’t download your debt letters because something went wrong on our
        end.
      </p>
      <h4>What you can do</h4>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        You can check back later or call the Debt Management Center at
        <va-telephone
          className="vads-u-margin-x--0p5"
          contact="8008270648"
        />{' '}
        to find out more information about how to resolve your debt.
      </p>
    </div>
  </va-alert>
);

export const DependentDebt = () => (
  <va-alert class="vads-u-margin-top--0 vads-u-padding--3" status="error">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        Your debt letters are currently unavailable.
      </h3>
      <p className="vads-u-font-family--sans">
        You can’t download your debt letters because something went wrong on our
        end.
      </p>
      <h4>What you can do</h4>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        If you need to access debt letters that were mailed to you, call the
        Debt Management Center at <va-telephone contact="8008270648" />.
      </p>
    </div>
  </va-alert>
);

export const NoDebtLinks = () => (
  <va-alert class="vads-u-padding--3 vads-u-margin-bottom--2" status="error">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">You don’t have any VA debt letters</h3>
      <p className="vads-u-font-family--sans">
        Our records show you don’t have any debt letters related to VA benefits.
        If you think this is an error, please contact the Debt Management Center
        at <va-telephone contact="8008270648" />.
      </p>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        If you have VA health care copay debt, go to our
        <a className="vads-u-margin-x--0p5" href="/health-care/pay-copay-bill/">
          Pay your VA copay bill
        </a>
        page to learn about your payment options.
      </p>
    </div>
  </va-alert>
);
