import _ from 'lodash';
// TODO: use lodash/fp

import dateUI from '../../../common/schemaform/definitions/date';
import phoneUI from '../../../common/schemaform/definitions/phone';
import { pciuAddressUISchema } from '../../../common/schemaform/definitions/address';
import EmailWidget from '../../../common/schemaform/widgets/EmailWidget';

import VerifiedReviewContainer from '../components/VerifiedReviewContainer';
import {
  PrimaryAddressViewField,
  getPage
} from '../helpers';

import initialData from '../tests/schema/initialData';

function isValidPhone(value) {
  if (value !== null) {
    return /^\d{10}$/.test(value);
  }
  return true;
}

function validatePhone(errors, phone) {
  if (phone && !isValidPhone(phone)) {
    errors.addError(
      'Phone numbers must be 10 digits (dashes allowed)'
    );
  }
}

export const hasForwardingAddress = formData => {
  return !!formData.veteran['view:hasForwardingAddress'];
};

function createPrimaryAddressPage(formSchema, isReview) {
  const { veteran } = formSchema.properties;
  const veteranContactInformationSchema = _.omit(veteran, ['properties.homelessness', 'properties.serviceNumber']);


  const uiSchema = {
    veteran: {
      'ui:order': ['mailingAddress', 'primaryPhone', 'emailAddress', 'alternateEmailAddress', 'view:hasForwardingAddress', 'forwardingAddress'],
      mailingAddress: pciuAddressUISchema('mailingAddress'),
      // TODO: be schema phone validation needs to be updated
      primaryPhone: _.merge(phoneUI('Primary telephone number'), {
        'ui:validations': [validatePhone]
      }),
      emailAddress: {
        'ui:title': 'Email address',
        'ui:widget': EmailWidget
      },
      alternateEmailAddress: {
        'ui:title': 'Alternate email address',
        'ui:widget': EmailWidget
      },
      'view:hasForwardingAddress': {
        'ui:title':
        'I want to provide a forwarding address since my address will be changing soon.'
      },
      forwardingAddress: {
        'ui:options': {
          expandUnder: 'view:hasForwardingAddress',
        },
        'view:forwardingAddress': pciuAddressUISchema('forwardingAddress', 'Forwarding address'),
        effectiveDate: _.merge(dateUI('Effective date'), { 'ui:required': hasForwardingAddress })
      }
    }
  };
  const schema = {
    type: 'object',
    properties: {
      veteran: {
        type: 'object',
        properties: {
          'view:hasForwardingAddress': {
            type: 'boolean'
          },
          emailAddress: {
            type: 'string'
          },
          alternateEmailAddress: {
            type: 'string'
          },
          mailingAddress: {
            type: 'object',
            properties: {
              type: {
                type: 'string'
              },
              country: {
                type: 'string'
              },
              city: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  };


  // _.unset(schema.properties.veteran.properties.forwardingAddress, 'required');
  _.set(schema, 'properties.veteran.properties.forwardingAddress', {
    type: 'object',
    properties: {
      'view:forwardingAddress': {
        type: 'object',
        properties: {
          country: {
            type: 'string'
          },
          city: {
            type: 'string'
          }
        }
      }
    },
    effectiveDate: veteranContactInformationSchema.properties.forwardingAddress.properties.effectiveDate
  });

  // _.unset(schema.properties.veteran.properties.forwardingAddress.properties['view:forwardingAddress'], 'required');
  _.unset(schema.properties.veteran.properties.forwardingAddress.properties['view:forwardingAddress'].properties, 'effectiveDate');
  _.set(schema, 'properties.veteran.properties.primaryPhone', { type: 'string' });

  const pageConfig = {
    pageTitle: 'Address information',
    isReview,
    component: VerifiedReviewContainer,
    description: 'Here’s the address we have on file for you. We’ll use this address to mail you any important information about your disability claim. If you need to update your address, you can click the Edit button.',
    verifiedReviewComponent: PrimaryAddressViewField,
    uiSchema,
    schema,
    initialData
  };

  return getPage(pageConfig, 'Veteran Details');
}

export const createVerifiedPrimaryAddressPage = formConfig =>
  createPrimaryAddressPage(formConfig, true);

export const createUnverifiedPrimaryAddressPage = formConfig =>
  createPrimaryAddressPage(formConfig, false);
