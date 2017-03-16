import _ from 'lodash/fp';

import * as ssn from '../../common/schemaform/definitions/ssn';

// TODO: move vaFileNumber out of 1995 and into a shared backend definition
import fullSchema1995 from 'vets-json-schema/dist/change-of-program-schema.json';
const {
  vaFileNumber
} = fullSchema1995.definitions;


export const uiSchema = {
  veteranSocialSecurityNumber: _.assign(ssn.uiSchema, {
    'ui:required': (form) => !form.veteranId['view:noSSN']
  }),
  'view:noSSN': {
    'ui:title': 'I don’t have a Social Security number',
    'ui:options': {
      hideOnReview: true
    }
  },
  vaFileNumber: {
    'ui:required': (form) => !!form.veteranId['view:noSSN'],
    'ui:title': 'File number',
    'ui:errorMessages': {
      pattern: 'File number must be 8 digits'
    },
    'ui:options': {
      expandUnder: 'view:noSSN'
    }
  }
};

// Placeholder in case we need to pass in customizations for various edu forms
export const schema = {
  type: 'object',
  properties: {
    veteranSocialSecurityNumber: ssn.schema,
    'view:noSSN': {
      type: 'boolean'
    },
    vaFileNumber
  }
};
