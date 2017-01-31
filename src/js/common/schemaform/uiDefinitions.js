import _ from 'lodash/fp';

import { validateSSN, validateDate, validateDateRange } from './validation';

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
  'ui:title': 'Social Security number',
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
    'ui:validations': [
      validateDateRange
    ],
    'ui:errorMessages': {
      dateRange: 'End of service must be after start of service'
    },
    from: _.merge(uiDate, {
      'ui:title': from
    }),
    to: _.merge(uiDate, {
      'ui:title': to
    })
  };
}

export const uiAddress = {
  country: {
    'ui:title': 'Country'
  },
  street: {
    'ui:title': 'Street'
  },
  street2: {
    'ui:title': 'Line 2'
  },
  city: {
    'ui:title': 'City'
  },
  state: {
    'ui:title': 'State'
  },
  postalCode: {
    'ui:title': 'Postal code'
  }
};

export const uiPhone = {
  'ui:title': 'Phone',
  'ui:options': {
    widgetClassNames: 'home-phone va-input-medium-large',
    inputType: 'tel'
  }
};
