import Raven from 'raven-js';

export const formTitles = {
  '21P-527EZ': 'Veterans pension benefits (21P-527EZ)',
  '21P-530': 'burial benefits (21P-530)',
  '1010ez': 'health care (10-10EZ)',
  '22-1990': 'education benefits (22-1990)',
  '22-1990E': 'education benefits (22-1990E)',
  '22-1990N': 'education benefits (22-1990N)',
  '22-1995': 'education benefits (22-1995)',
  '22-5490': 'education benefits (22-5490)',
  '22-5495': 'education benefits (22-5495)',
  '10-10007': 'pre-need determination of eligibility in a VA National Cemetery'
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
  '22-5495': '/education/apply-for-education-benefits/application/5495/',
  '40-10007': '/burials-and-memorials/burial-planning/application/'
};

export const trackingPrefixes = {
  '21P-527EZ': 'pensions-527EZ-',
  '21P-530': 'burials-530-',
  '1010ez': 'hca-',
  '22-1990': 'edu-',
  '22-1990E': 'edu-1990e-',
  '22-1990N': 'edu-1990n-',
  '22-1995': 'edu-1995-',
  '22-5490': 'edu-5490-',
  '22-5495': 'edu-5495-',
  '40-10007': 'preneed-'
};

export const sipEnabledForms = new Set(['1010ez', '21P-527EZ', '21P-530']);

export function isSIPEnabledForm(savedForm) {
  const formNumber = savedForm.form;
  if (!formTitles[formNumber] || !formLinks[formNumber]) {
    Raven.captureMessage('vets_sip_list_item_missing_info');
    return false;
  }
  if (!sipEnabledForms.has(formNumber)) {
    throw new Error(`Could not find form ${trackingPrefixes[formNumber]} in list of sipEnabledForms`);
  }
  return true;
}
