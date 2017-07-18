import React from 'react';
import moment from 'moment';
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
    },
    // can't use toISOString because we need the offset
    localTime: moment().format('Y-MM-DD[T]kk:mm:ssZZ')
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
    <span><strong>Note:</strong> At the end of the application, you will be asked to upload documentation for any medical, legal, or other unreimbursed expenses you incurred.</span>
  </div>
);

export const wartimeWarning = (
  <div className="usa-alert usa-alert-warning no-background-image">
    <span><strong>Note:</strong> You have indicated that you did not serve during an <a href="http://www.benefits.va.gov/pension/wartimeperiod.asp" target="_blank"> eligible wartime period</a>. Find out if you still qualify. <a href="/pension/eligibility" target="_blank">Check your eligibility.</a></span>
  </div>
);

const warDates = [
  ['1916-05-09', '1917-04-05'], // Mexican Border Period (May 9, 1916 - April 5, 1917)
  ['1917-04-06', '1918-11-11'], // World War I (April 6, 1917 - November 11, 1918)
  ['1941-12-07', '1946-12-31'], // World War II (December 7, 1941 - December 31, 1946)
  ['1950-06-27', '1955-01-31'], // Korean Conflict (June 27, 1950 - January 31, 1955)
  ['1964-08-05', '1975-05-07'], // Vietnam Era (August 5, 1964 - May 7, 1975)
  ['1990-08-02']// Gulf War (August 2, 1990)
];

export function servedDuringWartime(period) {
  return warDates.some((warTime) => {
    const [warStart, warEnd] = warTime;
    const { from: periodStart, to: periodEnd } = period;

    // If the service period starts before the war ends and finishes after the
    // war begins, they served during a wartime.
    const overlap = moment(periodEnd).isSameOrAfter(warStart) && moment(periodStart).isSameOrBefore(warEnd);
    return warEnd ? overlap : moment(warStart).isSameOrBefore(periodEnd);
  });
}

export const uploadMessage = (
  <div className="usa-alert usa-alert-info">
    <div className="usa-alert-body">If you have many documents to upload you can mail them to us.<br/><br/><em>We’ll provide an address after you finish the application.</em></div>
  </div>
);
