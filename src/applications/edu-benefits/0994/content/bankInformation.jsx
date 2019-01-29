import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

export const bankInfoTitle = <h4>Bank Information</h4>;

export const bankInfoDescription =
  'This is your bank account information we have on file. We’ll pay your education benefit to this account.';
export const bankInfoNote = (
  <p>
    <i>Note: </i>
    Changes you make to this information will only apply to this specific form.
    If you need to update your bank account information on all VA systems,
    please call Veterans Benefits Assistance at 1-800-827-1000, Monday through
    Friday, 8:00 a.m. to 9:00 p.m. (ET).
  </p>
);

export const bankInfoHelpText = (
  <AdditionalInfo triggerText="What if I don’t have a bank account?">
    The Department of Treasury requires all federal benefit payments be made by
    electronic funds transfer (EFT), also called direct deposit. If you do not
    have a bank account, you must receive your payment through Direct Express
    Debit MasterCard. To request a Direct Express Debit MasterCard, apply at{' '}
    <a href="www.usdirectexpress.com">Direct Express</a> or call 1-800-333-1795.
    If you elect not to enroll, you must contact representatives handling waiver
    requests for the Department of Treasury at 1-888-224-2950. They will
    encourage your participation in EFT and address any questions or concerns
    you may have.
  </AdditionalInfo>
);
