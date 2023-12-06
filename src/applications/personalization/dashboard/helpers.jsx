import React from 'react';
import * as Sentry from '@sentry/browser';
import { isPlainObject } from 'lodash';
import { isAfter, parse } from 'date-fns';
import { VA_FORM_IDS } from '~/platform/forms/constants';
import recordEvent from '~/platform/monitoring/record-event';
import { getAppUrl } from '~/platform/utilities/registry-helpers';

export const formBenefits = {
  [VA_FORM_IDS.FORM_20_10206]: 'personal records request',
  [VA_FORM_IDS.FORM_21_0972]: 'alternate signer',
  [VA_FORM_IDS.FORM_21_10210]: 'lay/witness statement',
  [VA_FORM_IDS.FORM_21_4142]: 'authorization to release medical information',
  [VA_FORM_IDS.FORM_21_526EZ]: 'disability compensation',
  [VA_FORM_IDS.FORM_21P_0847]: 'substitute claimant',
  [VA_FORM_IDS.FORM_21P_527EZ]: 'Veterans pension benefits',
  [VA_FORM_IDS.FORM_21P_530]: 'burial benefits',
  [VA_FORM_IDS.FORM_10_10EZ]: 'health care benefits',
  [VA_FORM_IDS.FORM_22_0993]: 'opt out',
  [VA_FORM_IDS.FORM_22_0994]: 'VET TEC',
  [VA_FORM_IDS.FORM_22_1990]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1990E]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1990EZ]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1990N]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1995]: 'education benefits',
  [VA_FORM_IDS.FORM_22_5490]: 'education benefits',
  [VA_FORM_IDS.FORM_22_5495]: 'education benefits',
  [VA_FORM_IDS.FORM_22_10203]: 'Rogers STEM Scholarship',
  [VA_FORM_IDS.FORM_26_4555]: 'specially adapted housing grant',
  [VA_FORM_IDS.FORM_28_1900]: 'Veteran Readiness and Employment Benefits',
  [VA_FORM_IDS.FORM_40_10007]:
    'pre-need determination of eligibility in a VA national cemetery',
  [VA_FORM_IDS.FEEDBACK_TOOL]: 'feedback',
  [VA_FORM_IDS.FORM_21_686C]: 'dependent status',
  [VA_FORM_IDS.FORM_10182]: 'Board Appeal',
  [VA_FORM_IDS.FORM_20_0995]: 'Supplemental Claim',
  [VA_FORM_IDS.FORM_20_0996]: 'Higher-Level Review',
  [VA_FORM_IDS.FORM_VA_2346A]: 'hearing aid batteries and accessories',
  [VA_FORM_IDS.FORM_5655]: 'financial status report',
};

export const formTitles = Object.keys(formBenefits).reduce((titles, key) => {
  let formNumber;
  if (key === VA_FORM_IDS.FORM_40_10007) {
    formNumber = '';
  } else if (key === VA_FORM_IDS.FORM_10_10EZ) {
    formNumber = ' (10-10EZ)';
  } else if (key === VA_FORM_IDS.FEEDBACK_TOOL) {
    formNumber = ' (GI Bill School Feedback Tool)';
  } else {
    formNumber = ` (${key})`;
  }
  const formTitle = `${formBenefits[key]}${formNumber}`;
  titles[key] = formTitle; // eslint-disable-line no-param-reassign
  return titles;
}, {});

export const formDescriptions = Object.keys(formBenefits).reduce(
  (descriptions, key) => {
    let formNumber;
    if (key === VA_FORM_IDS.FORM_40_10007) {
      formNumber = '';
    } else if (key === VA_FORM_IDS.FORM_10_10EZ) {
      formNumber = '(10-10EZ)';
    } else {
      formNumber = `(${key})`;
    }
    let formDescription = `${formBenefits[key]} application ${formNumber}`;
    if (key === VA_FORM_IDS.FORM_VA_2346A) {
      formDescription = `${formBenefits[key]} ${formNumber}`;
    }
    return { ...descriptions, [key]: formDescription };
  },
  {},
);

export const formLinks = {
  [VA_FORM_IDS.FEEDBACK_TOOL]: `${getAppUrl('feedback-tool')}/`,
  [VA_FORM_IDS.FORM_10_10EZ]: `${getAppUrl('hca')}/`,
  [VA_FORM_IDS.FORM_10182]: `${getAppUrl('10182-board-appeal')}/`,
  [VA_FORM_IDS.FORM_20_0995]: `${getAppUrl('995-supplemental-claim')}/`,
  [VA_FORM_IDS.FORM_20_0996]: `${getAppUrl('0996-higher-level-review')}/`,
  [VA_FORM_IDS.FORM_20_10206]: `${getAppUrl('10206-pa')}/`,
  [VA_FORM_IDS.FORM_21_0972]: `${getAppUrl('21-0972-alternate-signer')}/`,
  [VA_FORM_IDS.FORM_21_10210]: `${getAppUrl('10210-lay-witness-statement')}/`,
  [VA_FORM_IDS.FORM_21_4142]: `${getAppUrl('21-4142-medical-release')}/`,
  [VA_FORM_IDS.FORM_21_526EZ]: `${getAppUrl('526EZ-all-claims')}/`,
  [VA_FORM_IDS.FORM_21_686C]: `${getAppUrl('686C-674')}/`,
  [VA_FORM_IDS.FORM_21P_0847]: `${getAppUrl('21P-0847-substitute-claimant')}/`,
  [VA_FORM_IDS.FORM_21P_527EZ]: `${getAppUrl('pensions')}/`,
  [VA_FORM_IDS.FORM_21P_530]: `${getAppUrl('burials')}/`,
  [VA_FORM_IDS.FORM_22_0993]: `${getAppUrl('0993-edu-benefits')}/`,
  [VA_FORM_IDS.FORM_22_0994]: `${getAppUrl('0994-edu-benefits')}/`,
  [VA_FORM_IDS.FORM_22_1990]: `${getAppUrl('1990-edu-benefits')}/`,
  [VA_FORM_IDS.FORM_22_1990E]: `${getAppUrl('1990e-edu-benefits')}/`,
  [VA_FORM_IDS.FORM_22_1990EZ]: `${getAppUrl('1990ez-edu-benefits')}/`,
  [VA_FORM_IDS.FORM_22_1990N]: `${getAppUrl('1990n-edu-benefits')}/`,
  [VA_FORM_IDS.FORM_22_1995]: `${getAppUrl('1995-edu-benefits')}/`,
  [VA_FORM_IDS.FORM_22_5490]: `${getAppUrl('5490-edu-benefits')}/`,
  [VA_FORM_IDS.FORM_22_5495]: `${getAppUrl('5495-edu-benefits')}/`,
  [VA_FORM_IDS.FORM_22_10203]: `${getAppUrl('10203-edu-benefits')}/`,
  [VA_FORM_IDS.FORM_26_4555]: `${getAppUrl('4555-adapted-housing')}/`,
  [VA_FORM_IDS.FORM_28_1900]: `${getAppUrl('28-1900-chapter-31')}/`,
  [VA_FORM_IDS.FORM_40_10007]: `${getAppUrl('pre-need')}/`,
  [VA_FORM_IDS.FORM_5655]: `${getAppUrl('request-debt-help-form-5655')}/`,
  [VA_FORM_IDS.FORM_VA_2346A]: `${getAppUrl('order-form-2346')}/`,
};

export const trackingPrefixes = {
  [VA_FORM_IDS.FORM_20_10206]: 'pa-10206-',
  [VA_FORM_IDS.FORM_21_0972]: '21-0972-alternate-signer-',
  [VA_FORM_IDS.FORM_21_10210]: 'lay-witness-10210-',
  [VA_FORM_IDS.FORM_21_4142]: 'medical-release-4142-',
  [VA_FORM_IDS.FORM_21_526EZ]: 'disability-526EZ-',
  [VA_FORM_IDS.FORM_21P_0847]: '21P-0847-substitute-claimant-',
  [VA_FORM_IDS.FORM_21P_527EZ]: 'pensions-527EZ-',
  [VA_FORM_IDS.FORM_21P_530]: 'burials-530-',
  [VA_FORM_IDS.FORM_10_10EZ]: 'hca-',
  [VA_FORM_IDS.FORM_22_0993]: 'edu-0993-',
  [VA_FORM_IDS.FORM_22_0994]: 'edu-0994-',
  [VA_FORM_IDS.FORM_22_1990]: 'edu-',
  [VA_FORM_IDS.FORM_22_1990E]: 'edu-1990e-',
  [VA_FORM_IDS.FORM_22_1990EZ]: 'edu-1990ez-',
  [VA_FORM_IDS.FORM_22_1990N]: 'edu-1990n-',
  [VA_FORM_IDS.FORM_22_1995]: 'edu-1995-',
  [VA_FORM_IDS.FORM_22_5490]: 'edu-5490-',
  [VA_FORM_IDS.FORM_22_5495]: 'edu-5495-',
  [VA_FORM_IDS.FORM_22_10203]: 'edu-10203-',
  [VA_FORM_IDS.FORM_26_4555]: 'adapted-housing-4555-',
  [VA_FORM_IDS.FORM_40_10007]: 'preneed-',
  [VA_FORM_IDS.FEEDBACK_TOOL]: 'gi_bill_feedback',
  [VA_FORM_IDS.FORM_21_686C]: '686-',
  [VA_FORM_IDS.FORM_10182]: '10182-board-appeal-',
  [VA_FORM_IDS.FORM_20_0995]: '995-supplemental-claim-',
  [VA_FORM_IDS.FORM_20_0996]: 'decision-reviews-va20-0996-',
  [VA_FORM_IDS.FORM_VA_2346A]: 'bam-2346a-',
  [VA_FORM_IDS.FORM_5655]: 'fsr-5655-',
};

export const sipEnabledForms = new Set([
  VA_FORM_IDS.FORM_10_10EZ,
  VA_FORM_IDS.FORM_20_10206,
  VA_FORM_IDS.FORM_21_0972,
  VA_FORM_IDS.FORM_21_10210,
  VA_FORM_IDS.FORM_21_4142,
  VA_FORM_IDS.FORM_21_686C,
  VA_FORM_IDS.FORM_21_526EZ,
  VA_FORM_IDS.FORM_21P_0847,
  VA_FORM_IDS.FORM_21P_527EZ,
  VA_FORM_IDS.FORM_21P_530,
  VA_FORM_IDS.FORM_22_0993,
  VA_FORM_IDS.FORM_22_0994,
  VA_FORM_IDS.FORM_22_1990,
  VA_FORM_IDS.FORM_22_1990E,
  VA_FORM_IDS.FORM_22_1990EZ,
  VA_FORM_IDS.FORM_22_1990N,
  VA_FORM_IDS.FORM_22_1995,
  VA_FORM_IDS.FORM_22_5490,
  VA_FORM_IDS.FORM_22_5495,
  VA_FORM_IDS.FORM_22_10203,
  VA_FORM_IDS.FORM_26_4555,
  VA_FORM_IDS.FORM_28_1900,
  VA_FORM_IDS.FORM_40_10007,
  VA_FORM_IDS.FEEDBACK_TOOL,
  VA_FORM_IDS.FORM_10182,
  VA_FORM_IDS.FORM_20_0995,
  VA_FORM_IDS.FORM_20_0996,
  VA_FORM_IDS.FORM_VA_2346A,
  VA_FORM_IDS.FORM_5655,
]);

// A dict of presentable form IDs. Generally this is just the form ID itself
// prefixed with `FORM` for display purposes (ex: 'FORM 21-526EZ'). The only
// exception to this rule right now is the FEEDBACK-TOOL.
export const presentableFormIDs = Object.keys(formBenefits).reduce(
  (prefixedIDs, formID) => {
    if (formID === VA_FORM_IDS.FEEDBACK_TOOL) {
      prefixedIDs[formID] = 'FEEDBACK TOOL'; // eslint-disable-line no-param-reassign
    } else if (formID === VA_FORM_IDS.FORM_10_10EZ) {
      prefixedIDs[formID] = `FORM 10-10EZ`; // eslint-disable-line no-param-reassign
    } else {
      prefixedIDs[formID] = `FORM ${formID}`; // eslint-disable-line no-param-reassign
    }
    return prefixedIDs;
  },
  {},
);

export function isSIPEnabledForm(savedForm) {
  const formNumber = savedForm.form;
  if (!formTitles[formNumber] || !formLinks[formNumber]) {
    Sentry.captureMessage('vets_sip_list_item_missing_info');
    return false;
  }
  if (!sipEnabledForms.has(formNumber)) {
    throw new Error(
      `Could not find form ${
        trackingPrefixes[formNumber]
      } in list of sipEnabledForms`,
    );
  }
  return true;
}

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

export const recordDashboardClick = (
  product,
  actionType = 'view-link',
) => () => {
  recordEvent({
    event: 'dashboard-navigation',
    'dashboard-action': actionType,
    'dashboard-product': product,
  });
};

export const renderWidgetDowntimeNotification = (appName, sectionTitle) => (
  downtime,
  children,
) => {
  if (downtime.status === 'down') {
    return (
      <div>
        <h2>{sectionTitle}</h2>
        <va-alert status="warning" isVisible>
          <h4 className="usa-alert-heading">
            {appName} is down for maintenance
          </h4>
          <div>
            We’re making some updates to our {appName.toLowerCase()} tool. We’re
            sorry it’s not working right now and hope to be finished by{' '}
            {downtime.startTime.format('MMMM Do')},{' '}
            {downtime.endTime.format('LT')}. Please check back soon.
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
  return statements
    ? statements.reduce((acc, currentCopay) => {
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
      }, null)
    : null;
};
