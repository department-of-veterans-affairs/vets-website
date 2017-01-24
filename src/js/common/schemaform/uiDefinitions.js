import _ from 'lodash/fp';

import { validateSSN, validateDate } from './validation';

export const uiFullName = {
  first: {
    'ui:title': 'First name'
  },
  last: {
    'ui:title': 'Last name'
  },
  middle: {
    'ui:title': 'Middle name'
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium'
    }
  }
};

export const uiSSN = {
  'ui:title': 'Social security number',
  'ui:options': {
    widgetClassNames: 'usa-input-medium'
  },
  'ui:validations': [
    validateSSN
  ],
  'ui:errorMessages': {
    pattern: 'Please enter a valid nine digit SSN (dashes allowed)'
  }
};

export const uiDate = {
  'ui:title': 'Date',
  'ui:widget': 'date',
  'ui:validations': [
    validateDate
  ],
  'ui:errorMessages': {
    pattern: 'Please provide a valid date'
  }
};

export function uiDateRange(from, to) {
  return {
    from: _.merge(uiDate, {
      'ui:title': from
    }),
    to: _.merge(uiDate, {
      'ui:title': to
    })
  };
}

export const uiPhone = {
  'ui:title': 'Phone',
  'ui:options': {
    widgetClassNames: 'home-phone va-input-medium-large',
    inputType: 'tel'
  }
};
