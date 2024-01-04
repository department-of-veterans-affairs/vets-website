import React from 'react';
import * as Sentry from '@sentry/browser';
import moment from 'moment';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { transformForSubmit } from '@department-of-veterans-affairs/platform-forms-system/helpers';
import numberToWords from '@department-of-veterans-affairs/platform-forms-system/numberToWords';
import titleCase from '@department-of-veterans-affairs/platform-utilities/titleCase';
import Scroll from 'react-scroll';
import { createSelector } from 'reselect';

const { scroller } = Scroll;
export const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

function replacer(key, value) {
  // if the containing object has a name, we’re in the national guard object
  // and we want to keep addresses no matter what
  if (
    !this.name &&
    typeof value !== 'undefined' &&
    typeof value.country !== 'undefined' &&
    (!value.street || !value.city || (!value.postalCode && !value.zipcode))
  ) {
    return undefined;
  }

  // clean up empty objects, which we have no reason to send
  if (typeof value === 'object') {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }
  }

  return value;
}

function checkStatus(guid) {
  return apiRequest(`${environment.API_URL}/v0/pension_claims/${guid}`, {
    mode: 'cors',
  }).catch(res => {
    if (res instanceof Error) {
      Sentry.captureException(res);
      Sentry.captureMessage('vets_pension_poll_client_error');

      // keep polling because we know they submitted earlier
      // and this is likely a network error
      return Promise.resolve();
    }

    // if we get here, it's likely that we hit a server error
    return Promise.reject(res);
  });
}

const POLLING_INTERVAL = 1000;

function pollStatus(
  { guid, confirmationNumber, regionalOffice },
  onDone,
  onError,
) {
  setTimeout(() => {
    checkStatus(guid)
      .then(res => {
        if (!res || res.data.attributes.state === 'pending') {
          pollStatus(
            { guid, confirmationNumber, regionalOffice },
            onDone,
            onError,
          );
        } else if (res.data.attributes.state === 'success') {
          const response = res.data.attributes.response || {
            confirmationNumber,
            regionalOffice,
          };
          onDone(response);
        } else {
          // needs to start with this string to get the right message on the form
          throw new Error(
            `vets_server_error_pensions: status ${res.data.attributes.state}`,
          );
        }
      })
      .catch(onError);
  }, window.VetsGov.pollTimeout || POLLING_INTERVAL);
}

function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form, replacer);
  return JSON.stringify({
    pensionClaim: {
      form: formData,
    },
    // can’t use toISOString because we need the offset
    localTime: moment().format('Y-MM-DD[T]kk:mm:ssZZ'),
  });
}

export function submit(form, formConfig) {
  const headers = { 'Content-Type': 'application/json' };
  const body = transform(formConfig, form);

  return apiRequest(`${environment.API_URL}/v0/pension_claims`, {
    body,
    headers,
    method: 'POST',
    mode: 'cors',
  })
    .then(resp => {
      const { guid, confirmationNumber, regionalOffice } = resp.data.attributes;
      return new Promise((resolve, reject) => {
        pollStatus(
          { guid, confirmationNumber, regionalOffice },
          response => {
            window.dataLayer.push({
              event: `${formConfig.trackingPrefix}-submission-successful`,
            });
            return resolve(response);
          },
          error => reject(error),
        );
      });
    })
    .catch(respOrError => {
      if (respOrError instanceof Response && respOrError.status === 429) {
        const error = new Error('vets_throttled_error_pensions');
        error.extra = parseInt(
          respOrError.headers.get('x-ratelimit-reset'),
          10,
        );

        return Promise.reject(error);
      }
      return Promise.reject(respOrError);
    });
}

export const employmentDescription = (
  <p className="pension-employment-desc">
    Please tell us about all of your employment, including self-employment,{' '}
    <strong>from one year before you became disabled</strong> to the present.
  </p>
);

export function isMarried(form = {}) {
  return ['Married', 'Separated'].includes(form.maritalStatus);
}

export function getMarriageTitle(index) {
  const desc = numberToWords(index + 1);
  return `${titleCase(desc)} marriage`;
}

export function getMarriageTitleWithCurrent(form, index) {
  if (isMarried(form) && form.marriages.length - 1 === index) {
    return 'Current marriage';
  }

  return getMarriageTitle(index);
}

export function createSpouseLabelSelector(nameTemplate) {
  return createSelector(
    form =>
      form.marriages && form.marriages.length
        ? form.marriages[form.marriages.length - 1].spouseFullName
        : null,
    spouseFullName => {
      if (spouseFullName) {
        return {
          title: nameTemplate(spouseFullName),
        };
      }

      return {
        title: null,
      };
    },
  );
}

export const formatCurrency = num => `$${num.toLocaleString()}`;

export const specialMonthlyPensionDescription = (
  <section>
    <p>
      If you have certain health needs or disabilities, you may be eligible for
      additional pension. We call this special monthly pension (SMP).
    </p>
    <p>
      You may be eligible for SMP if you need the regular assistance of another
      person, have severe visual impairment, or are generally confined to your
      immediate premises.
    </p>
  </section>
);

export const directDepositWarning = (
  <div className="pension-dd-warning">
    The Department of Treasury requires all federal benefit payments be made by
    electronic funds transfer (EFT), also called direct deposit. If you don’t
    have a bank account, you must get your payment through Direct Express Debit
    MasterCard. To request a Direct Express Debit MasterCard you must apply at{' '}
    <a
      href="http://www.usdirectexpress.com"
      rel="noopener noreferrer"
      target="_blank"
    >
      www.usdirectexpress.com
    </a>{' '}
    or by telephone at <va-telephone contact="8003331795" />. If you chose not
    to enroll, you must contact representatives handling waiver requests for the
    Department of Treasury at <va-telephone contact="8882242950" />. They will
    address any questions or concerns you may have and encourage your
    participation in EFT.
  </div>
);

export const wartimeWarning = (
  <div className="usa-alert usa-alert-warning background-color-only">
    <div className="usa-alert-text">
      <p>
        <strong>Note:</strong> You have indicated that you did not serve during
        an{' '}
        <a
          href="http://www.benefits.va.gov/pension/wartimeperiod.asp"
          rel="noopener noreferrer"
          target="_blank"
        >
          {' '}
          eligible wartime period
        </a>
        . Find out if you still qualify.{' '}
        <a href="/pension/eligibility/" target="_blank">
          Check your eligibility
        </a>
      </p>
    </div>
  </div>
);

const warDates = [
  ['1916-05-09', '1917-04-05'], // Mexican Border Period (May 9, 1916 - April 5, 1917)
  ['1917-04-06', '1918-11-11'], // World War I (April 6, 1917 - November 11, 1918)
  ['1941-12-07', '1946-12-31'], // World War II (December 7, 1941 - December 31, 1946)
  ['1950-06-27', '1955-01-31'], // Korean Conflict (June 27, 1950 - January 31, 1955)
  ['1964-08-05', '1975-05-07'], // Vietnam Era (August 5, 1964 - May 7, 1975)
  ['1990-08-02'], // Gulf War (August 2, 1990)
];

export function servedDuringWartime(period) {
  return warDates.some(warTime => {
    const [warStart, warEnd] = warTime;
    const { from: periodStart, to: periodEnd } = period;

    // If the service period starts before the war ends and finishes after the
    // war begins, they served during a wartime.
    const overlap =
      moment(periodEnd).isSameOrAfter(warStart) &&
      moment(periodStart).isSameOrBefore(warEnd);
    return warEnd ? overlap : moment(warStart).isSameOrBefore(periodEnd);
  });
}

export const disabilityDocs = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        You’ll need to provide all private medical records for your child’s
        disability.
      </div>
    </div>
  </div>
);

export const schoolAttendanceWarning = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Since your child is between 18 and 23 years old, you’ll need to fill out
        a Request for Approval of School Attendance (
        <a
          href="https://www.vba.va.gov/pubs/forms/VBA-21-674-ARE.pdf"
          rel="noopener noreferrer"
          target="_blank"
        >
          VA Form 21-674
        </a>
        ). <strong>You can send us this form later.</strong>
      </div>
    </div>
  </div>
);

export const dependentWarning = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Your child won’t qualify as a dependent unless they’re in school or
        disabled.
      </div>
    </div>
  </div>
);

export const dependentsMinItem = (
  <span>
    If you are claiming child dependents,{' '}
    <strong>you must add at least one</strong> here.
  </span>
);

export const expectedIncomeDescription = (
  <span>
    Any income you didn’t already report in this form that you expect to receive
    in the next 12 months
  </span>
);

export const spouseExpectedIncomeDescription = (
  <span>
    Any income you didn’t already report in this form that your spouse expects
    to receive in the next 12 months
  </span>
);

export const dependentExpectedIncomeDescription = (
  <span>
    Any income you didn’t already report in this form that your dependent
    expects to receive in the next 12 months
  </span>
);

export const dependentSeriouslyDisabledDescription = (
  <div className="vads-u-padding-y--1">
    <va-additional-info trigger="What do we mean by seriously disabled?">
      <span>
        A child is seriously disabled if they developed a permanent physical or
        mental disability before they turned 18 years old. A seriously disabled
        child can’t support or care for themselves.
      </span>
    </va-additional-info>
  </div>
);

export const contactWarning = (
  <div className="usa-alert usa-alert-info">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        We won’t contact this person without contacting you first.
      </div>
    </div>
  </div>
);

export const contactWarningMulti = (
  <div className="usa-alert usa-alert-info">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        We won’t contact any of the people listed here without contacting you
        first.
      </div>
    </div>
  </div>
);

export const IncomeSourceDescription = (
  <div>
    <p>
      We want to know more about the gross monthly income you, your spouse, and
      your dependents receive.
    </p>
    <p>List the sources of income for you, your spouse, and your dependents.</p>
  </div>
);
