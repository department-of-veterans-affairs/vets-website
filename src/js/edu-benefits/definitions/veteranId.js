import _ from 'lodash/fp';

import * as ssn from '../../common/schemaform/definitions/ssn';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

export const vaFileNumber = commonDefinitions.vaFileNumber;

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

export const uiSchema = {
  veteranSocialSecurityNumber: _.assign(ssn.uiSchema, {
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
