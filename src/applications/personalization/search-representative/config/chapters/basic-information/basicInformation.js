export const schema = {
  type: 'object',
  title: 'What kind of representative are you looking for?',
  properties: {
    vso: {
      type: 'boolean',
    },
    representativeOfVSO: {
      type: 'boolean',
    },
    attorney: {
      type: 'boolean',
    },
    claimsAgent: {
      type: 'boolean',
    },
  },
};

export const uiSchema = {
  'ui:description': 'Choose at least one',
  vso: {
    'ui:title': 'Veteran Service Organization (VS0)',
    'ui:options': {
      hideOnReview: true,
    },
  },
  representativeOfVSO: {
    'ui:title': 'Representative in a Veteran Service Organization',
    'ui:options': {
      hideOnReview: true,
    },
  },
  attorney: {
    'ui:title': 'Attorney (Lawyer)',
    'ui:options': {
      hideOnReview: true,
    },
  },
  claimsAgent: {
    'ui:title': 'Claims agent',
    'ui:options': {
      hideOnReview: true,
    },
  },
};
