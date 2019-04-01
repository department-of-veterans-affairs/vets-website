// import _ from '../../../../platform/utilities/data';
import merge from 'lodash/merge';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
// import dateUI from 'platform/forms-system/src/js/definitions/date';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

import ReviewCardField from '../components/ReviewCardField';

import {
  contactInfoDescription,
  contactInfoUpdateHelp,
  forwardingAddressDescription,
  ForwardingAddressViewField,
  phoneEmailViewField,
} from '../content/contactInformation';

import { isInFuture } from '../validations';

import {
  hasForwardingAddress,
  forwardingCountryIsUSA,
  addressUISchema,
} from '../utils';

import { ADDRESS_PATHS } from '../constants';

const {
  mailingAddress,
  forwardingAddress,
  phoneAndEmail,
} = fullSchema.properties;

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description': contactInfoDescription,
  phoneAndEmail: {
    'ui:title': 'Phone & email',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: phoneEmailViewField,
    },
    primaryPhone: {
      'ui:title': 'Phone number',
      'ui:widget': PhoneNumberWidget,
      'ui:reviewWidget': PhoneNumberReviewWidget,
      'ui:errorMessages': {
        pattern: 'Phone numbers must be 10 digits (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
      },
    },
    emailAddress: {
      'ui:title': 'Email address',
      'ui:errorMessages': {
        pattern: 'The email you enter should be in this format x@x.xx',
      },
    },
  },
  mailingAddress: addressUISchema(
    ADDRESS_PATHS.mailingAddress,
    'Mailing address',
    true,
  ),
  'view:hasForwardingAddress': {
    'ui:title': 'My address will be changing soon.',
  },
  forwardingAddress: merge(
    addressUISchema(ADDRESS_PATHS.forwardingAddress, 'Forwarding address'),
    {
      'ui:field': ReviewCardField,
      'ui:subtitle': forwardingAddressDescription,
      'ui:order': [
        'effectiveDate',
        'country',
        'addressLine1',
        'addressLine2',
        'addressLine3',
        'city',
        'state',
        'zipCode',
      ],
      'ui:options': {
        viewComponent: ForwardingAddressViewField,
        expandUnder: 'view:hasForwardingAddress',
      },
      effectiveDate: merge(
        dateRangeUI(
          'Start date',
          'End date (optional)',
          'End date must be after start date',
        ),
        {
          from: {
            'ui:required': hasForwardingAddress,
            'ui:validations': [isInFuture],
          },
        },
      ),
      country: {
        'ui:required': hasForwardingAddress,
      },
      addressLine1: {
        'ui:required': hasForwardingAddress,
      },
      city: {
        'ui:required': hasForwardingAddress,
      },
      state: {
        'ui:required': formData =>
          hasForwardingAddress(formData) && forwardingCountryIsUSA(formData),
      },
      zipCode: {
        'ui:required': formData =>
          hasForwardingAddress(formData) && forwardingCountryIsUSA(formData),
      },
    },
  ),
  'view:contactInfoDescription': {
    'ui:description': contactInfoUpdateHelp,
  },
};

export const schema = {
  type: 'object',
  properties: {
    phoneAndEmail,
    mailingAddress,
    'view:hasForwardingAddress': {
      type: 'boolean',
    },
    forwardingAddress,
    'view:contactInfoDescription': {
      type: 'object',
      properties: {},
    },
  },
};
