export const formBenefits = {
  '21-526EZ': 'increased disability compensation',
  '21P-527EZ': 'Veterans pension benefits',
  '21P-530': 'burial benefits',
  '1010ez': 'health care benefits',
  '22-0993': 'opt out',
  '22-0994': 'vet tec',
  '22-1990': 'education benefits',
  '22-1990E': 'education benefits',
  '22-1990N': 'education benefits',
  '22-1995': 'education benefits',
  '22-5490': 'education benefits',
  '22-5495': 'education benefits',
  '40-10007': 'pre-need determination of eligibility in a VA national cemetery',
  VIC: 'Veteran ID Card',
  'complaint-tool': 'feedback',
  'FEEDBACK-TOOL': 'feedback',
  '21-686C': 'dependent status',
};

export const formTitles = Object.keys(formBenefits).reduce((titles, key) => {
  let formNumber;
  if (key === '40-10007' || key === 'VIC') {
    formNumber = '';
  } else if (key === '1010ez') {
    formNumber = ' (10-10EZ)';
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
    if (key === '40-10007' || key === 'VIC') {
      formNumber = '';
    } else if (key === '1010ez') {
      formNumber = '(10-10EZ)';
    } else {
      formNumber = `(${key})`;
    }
    const formDescription = `${formBenefits[key]} application ${formNumber}`;
    descriptions[key] = formDescription; // eslint-disable-line no-param-reassign
    return descriptions;
  },
  {},
);

export const formLinks = {
  '21-526EZ': '/disability-benefits/apply/form-526-disability-claim/',
  '21P-527EZ': '/pension/application/527EZ/',
  '21P-530': '/burials-and-memorials/application/530/',
  '1010ez': '/health-care/apply/application/',
  '22-0993': '/education/opt-out-information-sharing/opt-out-form-0993/',
  '22-0994': '/education/apply-for-education-benefits/application/0994/',
  '22-1990': '/education/apply-for-education-benefits/application/1990/',
  '22-1990E': '/education/apply-for-education-benefits/application/1990E/',
  '22-1990N': '/education/apply-for-education-benefits/application/1990N/',
  '22-1995': '/education/apply-for-education-benefits/application/1995/',
  '22-5490': '/education/apply-for-education-benefits/application/5490/',
  '22-5495': '/education/apply-for-education-benefits/application/5495/',
  '40-10007':
    '/burials-and-memorials/pre-need/form-10007-apply-for-eligibility/',
  VIC: '/veteran-id-card/apply/',
  '21-686C': '/disability-benefits/686/dependent-status/',
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
  '22-5490': 'edu-5490-',
  '22-5495': 'edu-5495-',
  '40-10007': 'preneed-',
  VIC: 'veteran-id-card-',
  '21-686C': '686-',
};
