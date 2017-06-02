import { additionalSourcesUI } from './additionalSources';

export default {
  'ui:order': [
    'socialSecurity',
    'civilService',
    'railroad',
    'blackLung',
    'serviceRetirement',
    'ssi',
    'additionalSources'
  ],
  socialSecurity: {
    'ui:title': 'Social Security',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  civilService: {
    'ui:title': 'US Civil Service',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  railroad: {
    'ui:title': 'US Railroad Retirement',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  blackLung: {
    'ui:title': 'Black Lung Benefits',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  serviceRetirement: {
    'ui:title': 'Service Retirement',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  ssi: {
    'ui:title': 'Supplemental Security Income (SSI) or Public Assistance',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  additionalSources: additionalSourcesUI
};
