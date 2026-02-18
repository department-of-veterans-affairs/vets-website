import React from 'react';
import get from 'platform/forms-system/src/js/utilities/data/get';

export const usingDirectDeposit = formData =>
  get(['view:usingDirectDeposit'], formData) === true ||
  formData?.hasBankAccount === true ||
  formData?.hasBankAccount === 'Y' ||
  formData?.hasBankAccount === 'yes';

export const DirectDepositOtherOptions = (
  <div>
    <h4>Option 1: Get your payment through Direct Express Debit MasterCard</h4>
    <p>
      To request a Direct Express Debit MasterCard, call{' '}
      <va-telephone contact="8003331795" />.
    </p>
    <p>
      <va-link
        href="https://www.usdirectexpress.com/how_it_works.html"
        external
        text="Go to the Direct Express Debit Mastercard website to learn more"
      />
    </p>
    <p>
      Note: If you choose to get payments through a Direct Express Debit
      MasterCard, you’ll need to call <va-telephone contact="8882242950" /> to
      request a waiver from the Department of Treasury.
    </p>
    <h4>Option 2: Open a bank account</h4>
    <p>
      If you want to use direct deposit, the Veterans Benefits Banking Program
      (VBBP) can help you open a bank account. VBBP provides a list of
      Veteran-friendly banks and credit unions that will work with you to set up
      an account, or help you qualify for an account.
    </p>
    <p>
      To get started, call one of the participating banks or credit unions
      listed on the VBBP website. Be sure to mention the Veterans Benefits
      Banking Program.
    </p>
    <p>
      <va-link
        href="https://veteransbenefitsbanking.org/find-bank-credit-union/"
        external
        text="Go to the VBBP website"
      />
    </p>
  </div>
);
