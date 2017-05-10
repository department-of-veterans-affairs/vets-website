import _ from 'lodash/fp';

import ssnUI from '../../common/schemaform/definitions/ssn';

export function schema(currentSchema) {
  return {
    type: 'object',
    properties: {
      veteranSocialSecurityNumber: currentSchema.definitions.ssn,
      'view:noSSN': {
        type: 'boolean'
      },
      vaFileNumber: currentSchema.definitions.vaFileNumber
    }
  };
}

export const uiSchema = {
  veteranSocialSecurityNumber: _.assign(ssnUI, {
    'ui:required': (formData) => !_.get('view:veteranId.view:noSSN', formData)
  }),
  'view:noSSN': {
    'ui:title': 'I don’t have a Social Security number',
    'ui:options': {
      hideOnReview: true
    }
  },
  vaFileNumber: {
    'ui:required': (formData) => !!_.get('view:veteranId.view:noSSN', formData),
    'ui:title': 'File number',
    'ui:errorMessages': {
      pattern: 'File number must be 8 digits'
    },
    'ui:options': {
      expandUnder: 'view:noSSN'
    }
  }
};
