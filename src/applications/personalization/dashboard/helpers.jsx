import Raven from 'raven-js';
import hcaManifest from '../../hca/manifest.js';
import dependentStatusManifest from '../../disability-benefits/686/manifest.js';
import feedbackManifest from '../../edu-benefits/feedback-tool/manifest.js';
import burialsManifest from '../../burials/manifest.js';
import edu1990Manifest from '../../edu-benefits/1990/manifest.json';
import edu1995Manifest from '../../edu-benefits/1995/manifest.json';
import edu1990eManifest from '../../edu-benefits/1990e/manifest.json';
import edu1990nManifest from '../../edu-benefits/1990n/manifest.json';
import edu5490Manifest from '../../edu-benefits/5490/manifest.json';
import edu5495Manifest from '../../edu-benefits/5495/manifest.json';
import edu0993Manifest from '../../edu-benefits/0993/manifest.json';
import preneedManifest from '../../pre-need/manifest.json';
import pensionManifest from '../../pensions/manifest.json';
import disability526Manifest from '../../disability-benefits/526EZ/manifest.json';

import hcaConfig from '../../hca/config/form.js';
import dependentStatusConfig from '../../disability-benefits/686/config/form';
import feedbackConfig from '../../edu-benefits/feedback-tool/config/form.js';
import burialsConfig from '../../burials/config/form.js';
import edu1990Config from '../../edu-benefits/1990/config/form.js';
import edu1995Config from '../../edu-benefits/1995/config/form.js';
import edu1990eConfig from '../../edu-benefits/1990e/config/form.js';
import edu1990nConfig from '../../edu-benefits/1990n/config/form.js';
import edu5490Config from '../../edu-benefits/5490/config/form.js';
import edu5495Config from '../../edu-benefits/5495/config/form.js';
import edu0993Config from '../../edu-benefits/0993/config/form.js';
import preneedConfig from '../../pre-need/config/form.jsx';
import pensionConfig from '../../pensions/config/form.js';
import vicV2Config from '../../vic-v2/config/form';
import disability526Config from '../../disability-benefits/526EZ/config/form.js';

export const formConfigs = {
  '1010ez': hcaConfig,
  '21-526EZ': disability526Config,
  '21-686C': dependentStatusConfig,
  '21P-527EZ': pensionConfig,
  '21P-530': burialsConfig,
  '22-0993': edu0993Config,
  '22-1990': edu1990Config,
  '22-1990E': edu1990eConfig,
  '22-1990N': edu1990nConfig,
  '22-1995': edu1995Config,
  '22-5490': edu5490Config,
  '22-5495': edu5495Config,
  '40-10007': preneedConfig,
  VIC: vicV2Config,
  'FEEDBACK-TOOL': feedbackConfig,
};

export const formBenefits = {
  '21-526EZ': 'increased disability compensation',
  '21P-527EZ': 'Veterans pension benefits',
  '21P-530': 'burial benefits',
  '1010ez': 'health care',
  '22-0993': 'opt out',
  '22-1990': 'education benefits',
  '22-1990E': 'education benefits',
  '22-1990N': 'education benefits',
  '22-1995': 'education benefits',
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
  '22-1990': `${edu1990Manifest.rootUrl}/`,
  '22-1990E': `${edu1990eManifest.rootUrl}/`,
  '22-1990N': `${edu1990nManifest.rootUrl}/`,
  '22-1995': `${edu1995Manifest.rootUrl}/`,
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
  '22-1990': 'edu-',
  '22-1990E': 'edu-1990e-',
  '22-1990N': 'edu-1990n-',
  '22-1995': 'edu-1995-',
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
  '22-1990',
  '22-1990E',
  '22-1990N',
  '22-1995',
  '22-5490',
  '22-5495',
  '40-10007',
  'VIC',
  'FEEDBACK-TOOL',
]);

export function isSIPEnabledForm(savedForm) {
  const formNumber = savedForm.form;
  if (!formTitles[formNumber] || !formLinks[formNumber]) {
    Raven.captureMessage('vets_sip_list_item_missing_info');
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

export const isFormAuthorizable = formConfig => !!formConfig.authorize;

export const getFormAuthorizationState = (formConfig, state) =>
  formConfig.getAuthorizationState(state);
