import React from 'react';
import { capitalize, isPlainObject } from 'lodash';
import { isAfter, parse, format, parseISO } from 'date-fns';
import { VA_FORM_IDS, MY_VA_SIP_FORMS } from '~/platform/forms/constants';
import { getFormLink } from '~/platform/forms/helpers';
import recordEvent from '~/platform/monitoring/record-event';

/**
 * ATTENTION!!! Are you looking for the SIP form variables like formBenefits, formLinks, or trackingPrefixes?
 * if so, those variables have been moved to src/platform/forms/constants.js
 * they have also been changed to be consolidated into an array of objects: MY_VA_SIP_FORMS
 */
// A dict of presentable form IDs. Generally this is just the form ID itself
// prefixed with `FORM` for display purposes (ex: 'FORM 21-526EZ'). The only
// exception to this rule right now is the FEEDBACK-TOOL.
const idArray = MY_VA_SIP_FORMS.map(item => item.id);

export const presentableFormIDs = idArray.reduce((prefixedIDs, formID) => {
  if (formID === VA_FORM_IDS.FEEDBACK_TOOL) {
    prefixedIDs[formID] = 'FEEDBACK TOOL'; // eslint-disable-line no-param-reassign
  } else if (formID === VA_FORM_IDS.FORM_10_10EZ) {
    prefixedIDs[formID] = `FORM 10-10EZ`; // eslint-disable-line no-param-reassign
  } else if (formID === VA_FORM_IDS.FORM_21P_530EZ) {
    prefixedIDs[formID] = `FORM 21P-530EZ`; // eslint-disable-line no-param-reassign
  } else if (formID === '686C-674-V2') {
    prefixedIDs[formID] = `FORM 686C-674`; // eslint-disable-line no-param-reassign
  } else if (formID.includes('-UPLOAD')) {
    prefixedIDs[formID] = `FORM ${formID.replace('-UPLOAD', '')}`; // eslint-disable-line no-param-reassign
  } else {
    prefixedIDs[formID] = `FORM ${formID}`; // eslint-disable-line no-param-reassign
  }
  return prefixedIDs;
}, {});

export const isSIPEnabledForm = savedForm => {
  const formNumber = savedForm.form;
  const foundForm = MY_VA_SIP_FORMS.find(form => form.id === formNumber);

  if (!foundForm?.title || !getFormLink(formNumber)) {
    return false;
  }

  if (!foundForm) {
    throw new Error(
      `Could not find form ${formNumber} in list of sipEnabledForms`,
    );
  }

  return true;
};

// This function is intended to be used as an Array.filter callback
export function filterOutExpiredForms(savedForm) {
  const { expiresAt } = savedForm.metadata;
  // The metadata.expiresAt should a seconds-since-epoch timestamp, but we
  // have some old tests where it is an ISO string. So this function is able
  // parse either a string or a number
  if (typeof expiresAt === 'number') {
    return new Date(expiresAt * 1000).getTime() > Date.now();
  }
  // if expiresAt isn't a number, then it must be a parsable date string
  return new Date(expiresAt).getTime() > Date.now();
}

// Callback to use with Array.sort that expects two properly formatted form
// objects (that have `metadata.expiresAt` properties). Used to sort form
// objects, placing the form that expires sooner before the form that expires
// later
export function sipFormSorter(formA, formB) {
  // simple helper to make sure the arg is an object with a metadata.expiresAt
  // prop
  function isValidForm(arg) {
    if (!isPlainObject(arg)) {
      throw new TypeError(`${arg} is not a plain object`);
    }
    if (
      !arg.metadata ||
      !arg.metadata.expiresAt ||
      typeof arg.metadata.expiresAt !== 'number'
    ) {
      throw new TypeError(`'metadata.expiresAt' is not set on ${arg}`);
    }
    return true;
  }

  [formA, formB].forEach(isValidForm);
  return formA.metadata.expiresAt - formB.metadata.expiresAt;
}

export const formatFormTitle = (title = '') =>
  capitalize(title)
    .replace(/\bform\b/gi, 'Form')
    .replace(/\bva\b/gi, 'VA')
    .replace(/ez/gi, 'EZ');

export const recordDashboardClick =
  (product, actionType = 'view-link') =>
  () => {
    recordEvent({
      event: 'dashboard-navigation',
      'dashboard-action': actionType,
      'dashboard-product': product,
    });
  };

export const renderWidgetDowntimeNotification =
  (appName, sectionTitle) => (downtime, children) => {
    if (downtime.status === 'down') {
      const startTime = parseISO(downtime.startTime);
      const endTime = parseISO(downtime.endTime);
      return (
        <div>
          <h2>{sectionTitle}</h2>
          <va-alert status="warning" isVisible>
            <h4 className="usa-alert-heading">
              {appName} is down for maintenance
            </h4>
            <div>
              We’re making some updates to our {appName.toLowerCase()} tool.
              We’re sorry it’s not working right now and hope to be finished by{' '}
              {format(startTime, 'MMMM do')}, {format(endTime, 'p')}. Please
              check back soon.
            </div>
          </va-alert>
        </div>
      );
    }
    return children;
  };

// sort by parsing the date string into a date object
export const sortStatementsByDate = statements => {
  const dateFormat = 'MM/dd/yyyy';
  return statements.sort(
    (a, b) =>
      parse(b.pSStatementDateOutput, dateFormat, new Date()) -
      parse(a.pSStatementDateOutput, dateFormat, new Date()),
  );
};

export const getLatestCopay = statements => {
  if (!statements) return null;
  return statements.reduce((acc, currentCopay) => {
    if (currentCopay.pSStatementDateOutput) {
      if (!acc) {
        return currentCopay;
      }
      return isAfter(
        new Date(acc.pSStatementDateOutput),
        new Date(currentCopay.pSStatementDateOutput),
      )
        ? acc
        : currentCopay;
    }
    return acc;
  }, null);
};

export const normalizeSubmissionStatus = apiStatusValue => {
  const value = apiStatusValue.toLowerCase();
  switch (value) {
    case 'vbms':
      return 'received';
    case 'error':
    case 'expired':
      return 'actionNeeded';
    default:
      return 'inProgress';
  }
};

const SUBMISSION_STATUS_MAP = {
  inProgress: 'Submission in Progress',
  actionNeeded: 'Action Needed',
  received: 'Received',
};

export const formatSubmissionDisplayStatus = status => {
  return SUBMISSION_STATUS_MAP[status];
};
