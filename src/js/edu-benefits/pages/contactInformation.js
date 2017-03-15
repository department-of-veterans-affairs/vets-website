import _ from 'lodash/fp';

import schemaDefinitions from 'vets-json-schema/dist/definitions.json';

import { validateMatch } from '../../common/schemaform/validation';

import {
  preferredContactMethodLabels
} from '../utils/helpers';

const {
  preferredContactMethod
} = schemaDefinitions;

import * as phone from '../../common/schemaform/definitions/phone';
import * as address from '../../common/schemaform/definitions/address';

export default function createContactInformationPage(addressField = 'veteranAddress') {
  return {
    title: 'Contact information',
    path: 'personal-information/contact-information',
    initialData: {},
    uiSchema: {
      preferredContactMethod: {
        'ui:title': 'How would you like to be contacted if we have questions about your application?',
        'ui:widget': 'radio',
        'ui:options': {
          labels: preferredContactMethodLabels
        }
      },
      [addressField]: address.uiSchema(),
      'view:otherContactInfo': {
        'ui:title': 'Other contact information',
        'ui:description': 'Please enter as much contact information as possible so we can get in touch with you, if necessary.',
        'ui:validations': [
          validateMatch('email', 'view:confirmEmail')
        ],
        email: {
          'ui:title': 'Email address'
        },
        'view:confirmEmail': {
          'ui:title': 'Re-enter email address',
          'ui:options': {
            hideOnReview: true
          }
        },
        homePhone: _.assign(phone.uiSchema('Primary telephone number'), {
          'ui:required': (form) => form.preferredContactMethod === 'phone'
        }),
        mobilePhone: phone.uiSchema('Mobile telephone number')
      }
    },
    schema: {
      type: 'object',
      properties: {
        preferredContactMethod,
        [addressField]: address.schema(true),
        'view:otherContactInfo': {
          type: 'object',
          required: ['email', 'view:confirmEmail'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            'view:confirmEmail': {
              type: 'string',
              format: 'email'
            },
            homePhone: phone.schema,
            mobilePhone: phone.schema
          }
        }
      }
    }
  };
}
