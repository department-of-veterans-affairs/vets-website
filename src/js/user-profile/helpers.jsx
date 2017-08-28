import Raven from 'raven-js';

const formTitles = {
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

const formLinks = {
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

const sipEnabledForms = new Set(['1010ez', '21P-527EZ', '21P-530']);

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
    handleIncompleteInformation(formNumber);
  }
  if (!formTitles[formNumber] || !formLinks[formNumber]) {
    handleNonSIPEnabledForm(formNumber);
  }
  return true;
}

export {
  formTitles,
  formLinks,
  sipEnabledForms
};
