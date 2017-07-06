import React from 'react';
import { transformForSubmit } from '../common/schemaform/helpers';

function replacer(key, value) {
  // if the containing object has a name, we're in the national guard object
  // and we want to keep addresses no matter what
  if (!this.name && typeof value !== 'undefined' && typeof value.country !== 'undefined' &&
    (!value.street || !value.city || (!value.postalCode && !value.zipcode))) {
    return undefined;
  }

  // clean up empty objects, which we have no reason to send
  if (typeof value === 'object') {
    const fields = Object.keys(value);
    if (fields.length === 0 || fields.every(field => value[field] === undefined)) {
      return undefined;
    }
  }

  return value;
}

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form, replacer);
  return JSON.stringify({
    pensionClaim: {
      form: formData
    }
  });
}

export const employmentDescription = <p className="pension-employment-desc">Please tell us about all of your employment, including self-employment, <strong>from one year before you became disabled</strong> to the present.</p>;

export function isMarried(form = {}) {
  return ['Married', 'Separated'].includes(form.maritalStatus);
}

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

export function getSpouseMarriageTitle(index) {
  const desc = numberToWords[index];

  return desc ? `Spouse’s ${desc.toLowerCase()} marriage` : `Spouse marriage ${index + 1}`;
}

export function getMarriageTitleWithCurrent(form, index) {
  if (isMarried(form) && (form.marriages.length - 1) === index) {
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
      Maximum file size: 20MB
    </p>
  );
}

export const directDepositWarning = (
  <div className="pension-dd-warning">
    The Department of Treasury requires all federal benefit payments be made by electronic funds transfer (EFT), also called direct deposit. If you don't have a bank account, you must get your payment through Direct Express Debit MasterCard. To request a Direct Express Debit MasterCard you must apply at <a href="http://www.usdirectexpress.com" target="_blank">www.usdirectexpress.com</a> or by telephone at <a href="tel:8003331795" target="_blank">800-333-1795</a>. If you chose not to enroll, you must contact representatives handling waiver requests for the Department of Treasury at <a href="tel:8882242950" target="_blank">888-224-2950</a>. They will address any questions or concerns you may have and encourage your participation in EFT.
  </div>
);

export const applicantDescription = <p>You aren’t required to fill in <strong>all</strong> fields, but VA can evaluate your claim faster if you provide more information.</p>;

export const otherExpensesWarning = (
  <div className="usa-alert usa-alert-warning no-background-image">
    <span><strong>Note:</strong> At the end of the application, you will be asked to upload all receipts for any medical, legal, or other unreimbursed expenses you incurred.</span>
  </div>
);

