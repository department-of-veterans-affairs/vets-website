import React from 'react';

export const paymentInformationTitle = (
  <>
    <strong>Payment Information</strong>
    <br />
    We’ll pay your disability benefit to the account below.
  </>
);

export const viewAccountAlert = (
  <va-alert status="info">
    <p className="vads-u-margin-y--0">
      <strong>
        We’ll also use this account for any VA education benefits you already
        receive.
      </strong>{' '}
      We’re making this change to help protect you from fraud and to make sure
      we can pay you on time, every time, without error.
    </p>
  </va-alert>
);

export const addAccountAlert = (
  <va-alert status="info">
    <p className="vads-u-margin-top--0">
      <strong>
        We’ll use this bank account for all your VA benefit payments
      </strong>
    </p>
    <p>
      If we approve your application for disability benefits, we’ll update your
      direct deposit information for all your VA benefit payments. We’ll deposit
      any payments you may receive for disability or education benefits directly
      into the bank account you provide here.
    </p>
    <p>
      We’re making this change to help protect you from fraud and to make sure
      we can pay you on time, every time, without error.
    </p>
  </va-alert>
);

export const viewAccountAlertForNoPrefill = (
  <va-alert status="info">
    <p className="vads-u-margin-top--0">
      <strong>
        If we approve your application for disability benefits, we’ll also use
        this account for any VA education benefits you already receive.{' '}
      </strong>
      We’re making this change to help protect you from fraud and to make sure
      we can pay you on time, every time, without error.
    </p>
  </va-alert>
);

export const viewAccountAlertForModifiedPrefill = (
  <va-alert status="info">
    <p className="vads-u-margin-top--0">
      If we approve your application for disability benefits, we’ll use this
      account for future disability benefit payments{' '}
      <b>and also any VA education benefits you already receive.</b>
    </p>
    <p>
      Until then, we’ll deposit your current disability payments into the
      previous account we showed. To change your direct deposit information now,
      go to your{' '}
      <a href="/profile/direct-deposit" target="_blank" rel="noreferrer">
        VA.gov profile (opens in new tab)
      </a>
      .
    </p>
  </va-alert>
);
