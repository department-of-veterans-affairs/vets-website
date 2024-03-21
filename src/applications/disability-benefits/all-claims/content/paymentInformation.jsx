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
      <b>
        We’ll also use this account for any VA education benefits you already
        receive.
      </b>{' '}
      We’re making this change to help protect you from fraud and to make sure
      we can pay you on time, every time, without error.
    </p>
  </va-alert>
);

export const addAccountAlert = (
  <va-alert status="info">
    <div className="vads-u-margin-y--0">
      <b slot="headline">
        We’ll use this bank account for all your VA benefit payments
      </b>
      <p>
        If we approve your application for disability benefits, we’ll update
        your direct deposit information for all your VA benefit payments. We’ll
        deposit any payments you may receive for disability or education
        benefits directly into the bank account you provide here.
      </p>
      <p>
        We’re making this change to help protect you from fraud and to make sure
        we can pay you on time, every time, without error.
      </p>
    </div>
  </va-alert>
);
