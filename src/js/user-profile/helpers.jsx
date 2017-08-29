import Raven from 'raven-js';

import fullSchema1010ez from '../hca/config/form';
import fullSchema1990 from '../edu-benefits/1990-rjsf/config/form';
import fullSchema1990e from '../edu-benefits/1990e/config/form';
import fullSchema1990n from '../edu-benefits/1990n/config/form';
import fullSchema1995 from '../edu-benefits/1995/config/form';
import fullSchema5490 from '../edu-benefits/5490/config/form';
import fullSchema5495 from '../edu-benefits/5495/config/form';
import fullSchema527EZ from '../pensions/config/form';
import fullSchema530 from '../burials/config/form';


export const formTitles = {
  '21P-527EZ': 'Veterans pension benefits (21P-527EZ)',
  '21P-530': 'burial benefits (21P-530)',
  '1010ez': 'health care (10-10EZ)',
  '22-1990': 'education benefits (22-1990)',
  '22-1990E': 'education benefits (22-1990E)',
  '22-1990N': 'education benefits (22-1990N)',
  '22-1995': 'education benefits (22-1995)',
  '22-5490': 'education benefits (22-5490)',
  '22-5495': 'education benefits (22-5495)'
};

export const formLinks = {
  '21P-527EZ': '/pension/application/527EZ/',
  '21P-530': '/burials-and-memorials/application/530/',
  '1010ez': '/health-care/apply/application/',
  '22-1990': '/education/apply-for-education-benefits/application/1990/',
  '22-1990E': '/education/apply-for-education-benefits/application/1990e/',
  '22-1990N': '/education/apply-for-education-benefits/application/1990n/',
  '22-1995': '/education/apply-for-education-benefits/application/1995/',
  '22-5490': '/education/apply-for-education-benefits/application/5490/',
  '22-5495': '/education/apply-for-education-benefits/application/5495/'
};

export const trackingPrefixes = {
  '21P-527EZ': fullSchema527EZ.trackingPrefix,
  '21P-530': fullSchema530.trackingPrefix,
  '1010ez': fullSchema1010ez.trackingPrefix,
  '22-1990': fullSchema1990.trackingPrefix,
  '22-1990E': fullSchema1990e.trackingPrefix,
  '22-1990N': fullSchema1990n.trackingPrefix,
  '22-1995': fullSchema1995.trackingPrefix,
  '22-5490': fullSchema5490.trackingPrefix,
  '22-5495': fullSchema5495.trackingPrefix
};

export const sipEnabledForms = new Set(['1010ez', '21P-527EZ', '21P-530']);

export function handleNonSIPEnabledForm(formNumber) {
  throw new Error(`Could not find form ${formNumber} in list of sipEnabledForms`);
}

export function handleIncompleteInformation(trackingPrefix) {
  Raven.captureMessage('vets_sip_list_item_missing_info');
  window.dataLayer.push({
    event: `${trackingPrefix}sip-list-item-missing-info`
  });
  return false;
}

export function isSIPEnabledForm(savedForm) {
  const formNumber = savedForm.form;
  if (!sipEnabledForms.has(formNumber)) {
    return handleIncompleteInformation(formNumber);
  }
  if (!formTitles[formNumber] || !formLinks[formNumber]) {
    return handleNonSIPEnabledForm(trackingPrefixes[formNumber]);
  }
  return true;
}
