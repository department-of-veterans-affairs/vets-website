import React from 'react';
import * as Sentry from '@sentry/browser';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';
import titleCase from 'platform/utilities/data/titleCase';
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

// Includes obsolete 'dayPhone' and 'nightPhone' for stale forms
const usaPhoneKeys = ['phone', 'mobilePhone', 'dayPhone', 'nightPhone'];

export function replacer(key, value) {
  if (usaPhoneKeys.includes(key) && value?.length) {
    // Strip spaces, dashes, and parens from phone numbers
    return value.replace(/[^\d]/g, '');
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

export function transform(formConfig, form) {
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
  return ['MARRIED', 'SEPARATED'].includes(form.maritalStatus);
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

export function getDependentChildTitle(item, description) {
  if (item.fullName) {
    return `${item.fullName.first || ''} ${item.fullName.last ||
      ''} ${description}`;
  }
  return 'description';
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

export const directDepositWarning = (
  <div className="pension-dd-warning">
    <div>
      <p>
        The Department of Treasury requires all federal benefit payments be made
        by electronic funds transfer (EFT), also called direct deposit.
      </p>
    </div>
    <div>
      <h3>If you don’t have a bank account</h3>
      <p>
        If you don’t have a bank account, you must get your payment through
        Direct Express Debit MasterCard. To request a Direct Express Debit
        MasterCard, you’ll need to apply one of these two ways:
      </p>
      <ul>
        <li>
          <a
            href="http://www.usdirectexpress.com"
            rel="noopener noreferrer"
            target="_blank"
            aria-label="Apply online for a Direct Express Debit MasterCard (opens in new tab)"
          >
            Apply online for a Direct Express Debit MasterCard (opens in new
            tab)
          </a>
        </li>
        <li>
          Call <va-telephone contact="8003331795" /> to apply by phone
        </li>
      </ul>
    </div>
    <div>
      <h3>If you want to opt out of direct deposit</h3>
      <p>
        If you chose not to enroll, you must contact representatives handling
        waiver requests for the Department of Treasury at{' '}
        <va-telephone contact="8882242950" />. They will address any questions
        or concerns you may have and encourage your participation in EFT.
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

export const IncomeSourceDescription = (
  <div>
    <p>
      We want to know more about the gross monthly income you, your spouse, and
      your dependents receive.
    </p>
    <p>List the sources of income for you, your spouse, and your dependents.</p>
  </div>
);

export const generateHelpText = text => {
  return (
    <span className="vads-u-color--gray vads-u-margin-left--0">{text}</span>
  );
};

export const validateWorkHours = (errors, fieldData) => {
  if (fieldData > 168) {
    errors.addError('Enter a number less than 169');
  }
};

/**
 * Formats a full name from the given first, middle, last, and suffix
 *
 * @export
 * @param {*} {
 *   first = '',
 *   middle = '',
 *   last = '',
 *   suffix = '',
 * }
 * @return {string} The full name formatted with spaces
 */
export const formatFullName = ({
  first = '',
  middle = '',
  last = '',
  suffix = '',
}) => {
  // ensure that any middle initials are capitalized
  const formattedMiddle = middle
    ? middle.replaceAll(/\b\w\b/g, c => c.toUpperCase())
    : '';
  return [first, formattedMiddle, last, suffix]
    .filter(name => !!name)
    .join(' ');
};

export function isHomeAcreageMoreThanTwo(formData) {
  return (
    formData.homeOwnership === true && formData.homeAcreageMoreThanTwo === true
  );
}
