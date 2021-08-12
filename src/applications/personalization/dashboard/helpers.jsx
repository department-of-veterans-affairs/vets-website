import React from 'react';
import * as Sentry from '@sentry/browser';
import { isPlainObject } from 'lodash';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { VA_FORM_IDS } from 'platform/forms/constants.js';
import recordEvent from 'platform/monitoring/record-event';

import hcaManifest from 'applications/hca/manifest.json';
import dependentStatusManifest from 'applications/disability-benefits/686c-674/manifest.json';
import feedbackManifest from 'applications/edu-benefits/feedback-tool/manifest.json';
import burialsManifest from 'applications/burials/manifest.json';
import edu1990Manifest from 'applications/edu-benefits/1990/manifest.json';
import edu1995Manifest from 'applications/edu-benefits/1995/manifest.json';
import edu1990eManifest from 'applications/edu-benefits/1990e/manifest.json';
import edu1990nManifest from 'applications/edu-benefits/1990n/manifest.json';
import edu5490Manifest from 'applications/edu-benefits/5490/manifest.json';
import edu5495Manifest from 'applications/edu-benefits/5495/manifest.json';
import edu0993Manifest from 'applications/edu-benefits/0993/manifest.json';
import edu0994Manifest from 'applications/edu-benefits/0994/manifest.json';
import edu10203Manifest from 'applications/edu-benefits/10203/manifest.json';
import preneedManifest from 'applications/pre-need/manifest.json';
import pensionManifest from 'applications/pensions/manifest.json';
import disability526Manifest from 'applications/disability-benefits/all-claims/manifest.json';
import hlrManifest from 'applications/disability-benefits/996/manifest.json';
import mdotManifest from 'applications/disability-benefits/2346/manifest.json';
import fsrManifest from 'applications/financial-status-report/manifest.json';

export const formBenefits = {
  [VA_FORM_IDS.FORM_21_526EZ]: 'disability compensation',
  [VA_FORM_IDS.FORM_21P_527EZ]: 'Veterans pension benefits',
  [VA_FORM_IDS.FORM_21P_530]: 'burial benefits',
  [VA_FORM_IDS.FORM_10_10EZ]: 'health care benefits',
  [VA_FORM_IDS.FORM_22_0993]: 'opt out',
  [VA_FORM_IDS.FORM_22_0994]: 'VET TEC',
  [VA_FORM_IDS.FORM_22_1990]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1990E]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1990N]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1995]: 'education benefits',
  [VA_FORM_IDS.FORM_22_5490]: 'education benefits',
  [VA_FORM_IDS.FORM_22_5495]: 'education benefits',
  [VA_FORM_IDS.FORM_22_10203]: 'Rogers STEM Scholarship',
  [VA_FORM_IDS.FORM_40_10007]:
    'pre-need determination of eligibility in a VA national cemetery',
  [VA_FORM_IDS.FEEDBACK_TOOL]: 'feedback',
  [VA_FORM_IDS.FORM_21_686C]: 'dependent status',
  [VA_FORM_IDS.FORM_20_0996]: 'Higher-level review',
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
  [VA_FORM_IDS.FORM_21_526EZ]: `${disability526Manifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_21P_527EZ]: `${pensionManifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_21P_530]: `${burialsManifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_10_10EZ]: `${hcaManifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_22_0993]: `${edu0993Manifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_22_0994]: `${edu0994Manifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_22_1990]: `${edu1990Manifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_22_1990E]: `${edu1990eManifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_22_1990N]: `${edu1990nManifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_22_1995]: `${edu1995Manifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_22_5490]: `${edu5490Manifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_22_5495]: `${edu5495Manifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_22_10203]: `${edu10203Manifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_40_10007]: `${preneedManifest.rootUrl}/`,
  [VA_FORM_IDS.FEEDBACK_TOOL]: `${feedbackManifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_21_686C]: `${dependentStatusManifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_20_0996]: `${hlrManifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_VA_2346A]: `${mdotManifest.rootUrl}/`,
  [VA_FORM_IDS.FORM_5655]: `${fsrManifest.rootUrl}/`,
};

export const trackingPrefixes = {
  [VA_FORM_IDS.FORM_21_526EZ]: 'disability-526EZ-',
  [VA_FORM_IDS.FORM_21P_527EZ]: 'pensions-527EZ-',
  [VA_FORM_IDS.FORM_21P_530]: 'burials-530-',
  [VA_FORM_IDS.FORM_10_10EZ]: 'hca-',
  [VA_FORM_IDS.FORM_22_0993]: 'edu-0993-',
  [VA_FORM_IDS.FORM_22_0994]: 'edu-0994-',
  [VA_FORM_IDS.FORM_22_1990]: 'edu-',
  [VA_FORM_IDS.FORM_22_1990E]: 'edu-1990e-',
  [VA_FORM_IDS.FORM_22_1990N]: 'edu-1990n-',
  [VA_FORM_IDS.FORM_22_1995]: 'edu-1995-',
  [VA_FORM_IDS.FORM_22_5490]: 'edu-5490-',
  [VA_FORM_IDS.FORM_22_5495]: 'edu-5495-',
  [VA_FORM_IDS.FORM_22_10203]: 'edu-10203-',
  [VA_FORM_IDS.FORM_40_10007]: 'preneed-',
  [VA_FORM_IDS.FEEDBACK_TOOL]: 'gi_bill_feedback',
  [VA_FORM_IDS.FORM_21_686C]: '686-',
  [VA_FORM_IDS.FORM_20_0996]: 'decision-reviews-va20-0996-',
  [VA_FORM_IDS.FORM_VA_2346A]: 'bam-2346a-',
  [VA_FORM_IDS.FORM_5655]: 'fsr-5655-',
};

export const sipEnabledForms = new Set([
  VA_FORM_IDS.FORM_10_10EZ,
  VA_FORM_IDS.FORM_21_686C,
  VA_FORM_IDS.FORM_21_526EZ,
  VA_FORM_IDS.FORM_21P_527EZ,
  VA_FORM_IDS.FORM_21P_530,
  VA_FORM_IDS.FORM_22_0993,
  VA_FORM_IDS.FORM_22_0994,
  VA_FORM_IDS.FORM_22_1990,
  VA_FORM_IDS.FORM_22_1990E,
  VA_FORM_IDS.FORM_22_1990N,
  VA_FORM_IDS.FORM_22_1995,
  VA_FORM_IDS.FORM_22_5490,
  VA_FORM_IDS.FORM_22_5495,
  VA_FORM_IDS.FORM_22_10203,
  VA_FORM_IDS.FORM_40_10007,
  VA_FORM_IDS.FEEDBACK_TOOL,
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
    } else {
      prefixedIDs[formID] = `FORM ${formID}`; // eslint-disable-line no-param-reassign
    }
    // TODO: add an exception for 1010ez since that form ID is lowercase and lacks a dash?
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
        <AlertBox
          content={
            <div>
              <h4 className="usa-alert-heading">
                {appName} is down for maintenance
              </h4>
              <p>
                We’re making some updates to our {appName.toLowerCase()} tool.
                We’re sorry it’s not working right now and hope to be finished
                by {downtime.startTime.format('MMMM Do')},{' '}
                {downtime.endTime.format('LT')}. Please check back soon.
              </p>
            </div>
          }
          isVisible
          status="warning"
        />
      </div>
    );
  }
  return children;
};
