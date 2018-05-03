import _ from 'lodash';

import PCIUAddress from '../../../common/schemaform/fields/PCIUAddressField';
import dateUI from '../../../common/schemaform/definitions/date';
import phoneUI from '../../../common/schemaform/definitions/phone';
import { pciuAddressSchema, pciuAddressUISchema } from '../../../common/schemaform/definitions/address';
import { isValidPhone } from '../../../../platform/forms/validations';

import VerifiedReviewContainer from '../components/VerifiedReviewContainer';
import {
  PrimaryAddressViewField,
  getPage
} from '../helpers';

import initialData from '../tests/schema/initialData';

function validatePhone(errors, phone) {
  if (phone && !isValidPhone(phone)) {
    errors.addError('Phone numbers must be 10 digits (dashes allowed)');
  }
}

function createPrimaryAddressPage(formSchema, isReview) {
  const { date } = formSchema.definitions;

  const uiSchema = {
    veteran: {
      mailingAddress: pciuAddressUISchema('mailingAddress'),
      primaryPhone: _.assign(phoneUI('Primary telephone number'), {
        'ui:validations': [validatePhone]
      }),
      secondaryPhone: _.assign(phoneUI('Secondary telephone number'), {
        'ui:validations': [validatePhone]
      }),
      emailAddress: {
        'ui:title': 'Email address',
        'ui:errorMessages': {
          pattern: 'Please put your email in this format x@x.xxx'
        }
      },
      'view:hasForwardingAddress': {
        'ui:title':
        'I want to provide a forwarding address since my address will be changing soon.'
      },
      forwardingAddress: _.merge(
        pciuAddressUISchema('forwardingAddress', 'Forwarding address'),
        {
          'ui:options': {
            expandUnder: 'view:hasForwardingAddress'
          },
          country: {
            'ui:required': formData => _.get("veteran['view:hasForwardingAddress']", formData)
          },
          addressLine1: {
            'ui:required': formData => _.get("veteran['view:hasForwardingAddress']", formData)
          },
          effectiveDate: dateUI('Effective date')
        }
      )
    }
  };
  const schema = {
    type: 'object',
    properties: {
      veteran: {
        type: 'object',
        properties: {
          mailingAddress: pciuAddressSchema,
          primaryPhone: {
            type: 'string'
          },
          secondaryPhone: {
            type: 'string'
          },
          emailAddress: {
            type: 'string',
            format: 'email'
          },
          'view:hasForwardingAddress': {
            type: 'boolean'
          },
          forwardingAddress: _.merge({}, pciuAddressSchema, {
            type: 'object',
            properties: {
              effectiveDate: date
            }
          })
        }
      }
    }
  };

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
