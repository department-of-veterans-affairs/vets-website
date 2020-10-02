import React from 'react';
import * as Sentry from '@sentry/browser';
import { isPlainObject } from 'lodash';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { VA_FORM_IDS } from 'platform/forms/constants.js';
import recordEvent from 'platform/monitoring/record-event';
import getBenefitString from 'platform/forms-system/src/js/utilities/benefit-description';
import getSavedFormDescription from 'platform/forms-system/src/js/utilities/form-description';

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
import hlrManifest from 'applications/disability-benefits/996/manifest.json';
import mdotManifest from 'applications/disability-benefits/2346/manifest.json';

import hcaConfig from 'applications/hca/config/form.js';
import dependentStatusConfig from 'applications/disability-benefits/686c-674/config/form';
import feedbackConfig from 'applications/edu-benefits/feedback-tool/config/form.js';
import burialsConfig from 'applications/burials/config/form.js';
import edu1990Config from 'applications/edu-benefits/1990/config/form.js';
import edu1995Config from 'applications/edu-benefits/1995/config/form.js';
import edu1990eConfig from 'applications/edu-benefits/1990e/config/form.js';
import edu1990nConfig from 'applications/edu-benefits/1990n/config/form.js';
import edu5490Config from 'applications/edu-benefits/5490/config/form.js';
import edu5495Config from 'applications/edu-benefits/5495/config/form.js';
import edu0993Config from 'applications/edu-benefits/0993/config/form.js';
import edu0994Config from 'applications/edu-benefits/0994/config/form.js';
import edu10203Config from 'applications/edu-benefits/10203/config/form.js';
import preneedConfig from 'applications/pre-need/config/form.jsx';
import pensionConfig from 'applications/pensions/config/form.js';
import disability526Config from 'applications/disability-benefits/all-claims/config/form.js';
import hlrConfig from 'applications/disability-benefits/996/config/form';
import mdotConfig from 'applications/disability-benefits/2346/config/form';

export const formConfigs = {
  [VA_FORM_IDS.FORM_10_10EZ]: hcaConfig,
  [VA_FORM_IDS.FORM_21_526EZ]: disability526Config,
  [VA_FORM_IDS.FORM_21_686C]: dependentStatusConfig,
  [VA_FORM_IDS.FORM_21P_527EZ]: pensionConfig,
  [VA_FORM_IDS.FORM_21P_530]: burialsConfig,
  [VA_FORM_IDS.FORM_22_0993]: edu0993Config,
  [VA_FORM_IDS.FORM_22_0994]: edu0994Config,
  [VA_FORM_IDS.FORM_22_1990]: edu1990Config,
  [VA_FORM_IDS.FORM_22_1990E]: edu1990eConfig,
  [VA_FORM_IDS.FORM_22_1990N]: edu1990nConfig,
  [VA_FORM_IDS.FORM_22_1995]: edu1995Config,
  [VA_FORM_IDS.FORM_22_5490]: edu5490Config,
  [VA_FORM_IDS.FORM_22_5495]: edu5495Config,
  [VA_FORM_IDS.FORM_22_10203]: edu10203Config,
  [VA_FORM_IDS.FORM_40_10007]: preneedConfig,
  [VA_FORM_IDS.FEEDBACK_TOOL]: feedbackConfig,
  [VA_FORM_IDS.FORM_20_0996]: hlrConfig,
  [VA_FORM_IDS.FORM_VA_2346A]: mdotConfig,
};

export const formBenefits = {
  [VA_FORM_IDS.FORM_10_10EZ]: hcaConfig.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_21_526EZ]:
    disability526Config.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_21_686C]:
    dependentStatusConfig.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_21P_527EZ]: pensionConfig.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_21P_530]: burialsConfig.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_22_0993]: edu0993Config.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_22_0994]: edu0994Config.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_22_1990]: edu1990Config.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_22_1990E]: edu1990eConfig.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_22_1990N]: edu1990nConfig.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_22_1995]: edu1995Config.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_22_5490]: edu5490Config.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_22_5495]: edu5495Config.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_22_10203]: edu10203Config.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_40_10007]: preneedConfig.benefitDescription.benefitType,
  [VA_FORM_IDS.FEEDBACK_TOOL]: feedbackConfig.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_20_0996]: hlrConfig.benefitDescription.benefitType,
  [VA_FORM_IDS.FORM_VA_2346A]: mdotConfig.benefitDescription.benefitType,
};

export const formTitles = {
  [VA_FORM_IDS.FORM_10_10EZ]: getBenefitString(hcaConfig),
  [VA_FORM_IDS.FORM_21_526EZ]: getBenefitString(disability526Config),
  [VA_FORM_IDS.FORM_21_686C]: getBenefitString(dependentStatusConfig),
  [VA_FORM_IDS.FORM_21P_527EZ]: getBenefitString(pensionConfig),
  [VA_FORM_IDS.FORM_21P_530]: getBenefitString(burialsConfig),
  [VA_FORM_IDS.FORM_22_0993]: getBenefitString(edu0993Config),
  [VA_FORM_IDS.FORM_22_0994]: getBenefitString(edu0994Config),
  [VA_FORM_IDS.FORM_22_1990]: getBenefitString(edu1990Config),
  [VA_FORM_IDS.FORM_22_1990E]: getBenefitString(edu1990eConfig),
  [VA_FORM_IDS.FORM_22_1990N]: getBenefitString(edu1990nConfig),
  [VA_FORM_IDS.FORM_22_1995]: getBenefitString(edu1995Config),
  [VA_FORM_IDS.FORM_22_5490]: getBenefitString(edu5490Config),
  [VA_FORM_IDS.FORM_22_5495]: getBenefitString(edu5495Config),
  [VA_FORM_IDS.FORM_22_10203]: getBenefitString(edu10203Config),
  [VA_FORM_IDS.FORM_40_10007]: getBenefitString(preneedConfig),
  [VA_FORM_IDS.FEEDBACK_TOOL]: getBenefitString(feedbackConfig),
  [VA_FORM_IDS.FORM_20_0996]: getBenefitString(hlrConfig),
  [VA_FORM_IDS.FORM_VA_2346A]: getBenefitString(mdotConfig),
};

export const formDescriptions = {
  [VA_FORM_IDS.FORM_10_10EZ]: getSavedFormDescription(hcaConfig),
  [VA_FORM_IDS.FORM_21_526EZ]: getSavedFormDescription(disability526Config),
  [VA_FORM_IDS.FORM_21_686C]: getSavedFormDescription(dependentStatusConfig),
  [VA_FORM_IDS.FORM_21P_527EZ]: getSavedFormDescription(pensionConfig),
  [VA_FORM_IDS.FORM_21P_530]: getSavedFormDescription(burialsConfig),
  [VA_FORM_IDS.FORM_22_0993]: getSavedFormDescription(edu0993Config),
  [VA_FORM_IDS.FORM_22_0994]: getSavedFormDescription(edu0994Config),
  [VA_FORM_IDS.FORM_22_1990]: getSavedFormDescription(edu1990Config),
  [VA_FORM_IDS.FORM_22_1990E]: getSavedFormDescription(edu1990eConfig),
  [VA_FORM_IDS.FORM_22_1990N]: getSavedFormDescription(edu1990nConfig),
  [VA_FORM_IDS.FORM_22_1995]: getSavedFormDescription(edu1995Config),
  [VA_FORM_IDS.FORM_22_5490]: getSavedFormDescription(edu5490Config),
  [VA_FORM_IDS.FORM_22_5495]: getSavedFormDescription(edu5495Config),
  [VA_FORM_IDS.FORM_22_10203]: getSavedFormDescription(edu10203Config),
  [VA_FORM_IDS.FORM_40_10007]: getSavedFormDescription(preneedConfig),
  [VA_FORM_IDS.FEEDBACK_TOOL]: getSavedFormDescription(feedbackConfig),
  [VA_FORM_IDS.FORM_20_0996]: getSavedFormDescription(hlrConfig),
  [VA_FORM_IDS.FORM_VA_2346A]: getSavedFormDescription(mdotConfig),
};

export const formLinks = {
  [VA_FORM_IDS.FORM_21_526EZ]: `${disability526Config.rootUrl}/`,
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
