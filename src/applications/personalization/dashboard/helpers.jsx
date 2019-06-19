import React from 'react';
import * as Sentry from '@sentry/browser';
import { isPlainObject } from 'lodash';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import recordEvent from 'platform/monitoring/record-event';

import hcaManifest from 'applications/hca/manifest.js';
import dependentStatusManifest from 'applications/disability-benefits/686/manifest.js';
import feedbackManifest from 'applications/edu-benefits/feedback-tool/manifest.js';
import burialsManifest from 'applications/burials/manifest.js';
import edu1990Manifest from 'applications/edu-benefits/1990/manifest.json';
import edu1995Manifest from 'applications/edu-benefits/1995/manifest.json';
import edu1995StemManifest from 'applications/edu-benefits/1995-STEM/manifest.json';
import edu1990eManifest from 'applications/edu-benefits/1990e/manifest.json';
import edu1990nManifest from 'applications/edu-benefits/1990n/manifest.json';
import edu5490Manifest from 'applications/edu-benefits/5490/manifest.json';
import edu5495Manifest from 'applications/edu-benefits/5495/manifest.json';
import edu0993Manifest from 'applications/edu-benefits/0993/manifest.json';
import edu0994Manifest from 'applications/edu-benefits/0994/manifest.json';
import preneedManifest from 'applications/pre-need/manifest.json';
import pensionManifest from 'applications/pensions/manifest.json';
import disability526Manifest from 'applications/disability-benefits/526EZ/manifest.json';

import hcaConfig from 'applications/hca/config/form.js';
import dependentStatusConfig from 'applications/disability-benefits/686/config/form';
import feedbackConfig from 'applications/edu-benefits/feedback-tool/config/form.js';
import burialsConfig from 'applications/burials/config/form.js';
import edu1990Config from 'applications/edu-benefits/1990/config/form.js';
import edu1995Config from 'applications/edu-benefits/1995/config/form.js';
import edu1995StemConfig from 'applications/edu-benefits/1995-STEM/config/form.js';
import edu1990eConfig from 'applications/edu-benefits/1990e/config/form.js';
import edu1990nConfig from 'applications/edu-benefits/1990n/config/form.js';
import edu5490Config from 'applications/edu-benefits/5490/config/form.js';
import edu5495Config from 'applications/edu-benefits/5495/config/form.js';
import edu0993Config from 'applications/edu-benefits/0993/config/form.js';
import edu0994Config from 'applications/edu-benefits/0994/config/form.js';
import preneedConfig from 'applications/pre-need/config/form.jsx';
import pensionConfig from 'applications/pensions/config/form.js';
import vicV2Config from 'applications/vic-v2/config/form';
import disability526Config from 'applications/disability-benefits/526EZ/config/form.js';

export const formConfigs = {
  '1010ez': hcaConfig,
  '21-526EZ': disability526Config,
  '21-686C': dependentStatusConfig,
  '21P-527EZ': pensionConfig,
  '21P-530': burialsConfig,
  '22-0993': edu0993Config,
  '22-0994': edu0994Config,
  '22-1990': edu1990Config,
  '22-1990E': edu1990eConfig,
  '22-1990N': edu1990nConfig,
  '22-1995': edu1995Config,
  '22-1995-STEM': edu1995StemConfig,
  '22-5490': edu5490Config,
  '22-5495': edu5495Config,
  '40-10007': preneedConfig,
  VIC: vicV2Config,
  'FEEDBACK-TOOL': feedbackConfig,
};

export const formBenefits = {
  '21-526EZ': 'disability compensation',
  '21P-527EZ': 'Veterans pension benefits',
  '21P-530': 'burial benefits',
  '1010ez': 'health care benefits',
  '22-0993': 'opt out',
  '22-0994': 'VET TEC',
  '22-1990': 'education benefits',
  '22-1990E': 'education benefits',
  '22-1990N': 'education benefits',
  '22-1995': 'education benefits',
  '22-1995-STEM': 'education benefits',
  '22-5490': 'education benefits',
  '22-5495': 'education benefits',
  '40-10007': 'pre-need determination of eligibility in a VA national cemetery',
  VIC: 'Veteran ID Card',
  'FEEDBACK-TOOL': 'feedback',
  '21-686C': 'dependent status',
};

export const formTitles = Object.keys(formBenefits).reduce((titles, key) => {
  let formNumber;
  if (key === '40-10007' || key === 'VIC') {
    formNumber = '';
  } else if (key === '1010ez') {
    formNumber = ' (10-10EZ)';
  } else if (key === 'FEEDBACK-TOOL') {
    formNumber = ' (GI Bill School Feedback Tool)';
  } else {
    formNumber = ` (${key})`;
  }
  const formTitle = `${formBenefits[key]}${formNumber}`;
  titles[key] = formTitle; // eslint-disable-line no-param-reassign
  return titles;
}, {});

export const formLinks = {
  '21-526EZ': `${disability526Manifest.rootUrl}/`,
  '21P-527EZ': `${pensionManifest.rootUrl}/`,
  '21P-530': `${burialsManifest.rootUrl}/`,
  '1010ez': `${hcaManifest.rootUrl}/`,
  '22-0993': `${edu0993Manifest.rootUrl}/`,
  '22-0994': `${edu0994Manifest.rootUrl}/`,
  '22-1990': `${edu1990Manifest.rootUrl}/`,
  '22-1990E': `${edu1990eManifest.rootUrl}/`,
  '22-1990N': `${edu1990nManifest.rootUrl}/`,
  '22-1995': `${edu1995Manifest.rootUrl}/`,
  '22-1995-STEM': `${edu1995StemManifest.rootUrl}/`,
  '22-5490': `${edu5490Manifest.rootUrl}/`,
  '22-5495': `${edu5495Manifest.rootUrl}/`,
  '40-10007': `${preneedManifest.rootUrl}/`,
  // Not active, will need a new url if we start using this post WBC
  VIC: '/veteran-id-card/apply/',
  'FEEDBACK-TOOL': `${feedbackManifest.rootUrl}/`,
  '21-686C': `${dependentStatusManifest.rootUrl}/`,
};

export const trackingPrefixes = {
  '21-526EZ': 'disability-526EZ-',
  '21P-527EZ': 'pensions-527EZ-',
  '21P-530': 'burials-530-',
  '1010ez': 'hca-',
  '22-0993': 'edu-0993-',
  '22-0994': 'edu-0994-',
  '22-1990': 'edu-',
  '22-1990E': 'edu-1990e-',
  '22-1990N': 'edu-1990n-',
  '22-1995': 'edu-1995-',
  '22-1995-STEM': 'edu-1995-STEM-',
  '22-5490': 'edu-5490-',
  '22-5495': 'edu-5495-',
  '40-10007': 'preneed-',
  VIC: 'veteran-id-card-',
  'FEEDBACK-TOOL': 'gi_bill_feedback',
  '21-686C': '686-',
};

export const sipEnabledForms = new Set([
  '1010ez',
  '21-686C',
  '21-526EZ',
  '21P-527EZ',
  '21P-530',
  '22-0993',
  '22-0994',
  '22-1990',
  '22-1990E',
  '22-1990N',
  '22-1995',
  '22-1995-STEM',
  '22-5490',
  '22-5495',
  '40-10007',
  'VIC',
  'FEEDBACK-TOOL',
]);

// A dict of presentable form IDs. Generally this is just the form ID itself
// prefixed with `FORM` for display purposes (ex: 'FORM 21-526EZ'). The only
// exceptions to this rule right now are the FEEDBACK-TOOL and VIC.
export const presentableFormIDs = Object.keys(formBenefits).reduce(
  (prefixedIDs, formID) => {
    if (formID === 'FEEDBACK-TOOL') {
      prefixedIDs[formID] = 'FEEDBACK TOOL'; // eslint-disable-line no-param-reassign
    } else if (formID === 'VIC') {
      prefixedIDs[formID] = 'VETERAN ID CARD'; // eslint-disable-line no-param-reassign
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

export const isFormAuthorizable = formConfig =>
  !!formConfig && !!formConfig.authorize;

export const getFormAuthorizationState = (formConfig, state) =>
  formConfig.getAuthorizationState(state);

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
  switch (downtime.status) {
    case 'down':
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
    default:
      return children;
  }
};
