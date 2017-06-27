import React from 'react';
import { transformForSubmit } from '../common/schemaform/helpers';

export function transform(formConfig, form) {
  // delete form.data.privacyAgreementAccepted;
  // delete form.data.hasVisitedVAMC;
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    pensionClaim: {
      form: formData
    }
  });
}

export const employmentDescription = <p className="pension-employment-desc">Please tell us about all of your employment, including self-employment, <strong>from one year before you became disabled</strong> to the present.</p>;

const numberToWords = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth',
  5: 'Sixth',
  6: 'Seventh',
  7: 'Eighth',
  8: 'Ninth',
  9: 'Tenth'
};

export function getMarriageTitle(index) {
  const desc = numberToWords[index];

  return desc ? `${desc} marriage` : `Marriage ${index + 1}`;
}

export function getMarriageTitleWithCurrent(form, index) {
  if (form.maritalStatus === 'Married' && (form.marriages.length - 1) === index) {
    return 'Current marriage';
  }

  return getMarriageTitle(index);
}

export const spouseContribution = <span>How much do you <strong>contribute monthly</strong> to your spouse’s support?</span>;

export function fileHelp({ formContext }) {
  if (formContext.reviewMode) {
    return null;
  }

  return (
    <p>
      Files we accept: pdf, jpg, png<br/>
      Maximum file size: 2MB
    </p>
  );
}

export const directDepositWarning = (
  <div className="pension-dd-warning">
    The Department of Treasury requires all federal benefit payments be made by electronic funds transfer (EFT), also called direct deposit. If you don't have a bank account, you must get your payment through Direct Express Debit MasterCard. To request a Direct Express Debit MasterCard you must apply at <a href="http://www.usdirectexpress.com" target="_blank">www.usdirectexpress.com</a> or by telephone at <a href="tel:8003331795" target="_blank">800-333-1795</a>. If you chose not to enroll, you must contact representatives handling waiver requests for the Department of Treasury at <a href="tel:8882242950" target="_blank">888-224-2950</a>. They will address any questions or concerns you may have and encourage your participation in EFT.
  </div>
);
