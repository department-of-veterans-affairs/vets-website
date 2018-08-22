import fullSchema from '../config/schema';

import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import {
  ReservesGuardDescription,
} from '../utils';

const {
  unitPhone,
  unitAddress,
  unitName,
  obligationTermOfServiceDateRange
} = fullSchema.properties.serviceInformation.properties.reservesNationalGuardService.properties;

export const uiSchema = {
  'ui:title': 'Reserves and National Guard Information',
  'ui:description': ReservesGuardDescription,
  obligationTermOfServiceDateRange: dateRangeUI(
    'Obligation start date',
    'Obligation end date',
    'End date must be after start date'
  ),
  unitName: {
    'ui:title': 'Unit name',
  },
  unitAddress: {
    'ui:title': 'Unit address',
    'ui:order': [
      'country',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'state',
      'zipCode'
    ],
    country: {
      'ui:title': 'Country'
    },
    addressLine1: {
      'ui:title': 'Street address'
    },
    addressLine2: {
      'ui:title': 'Street address (optional)'
    },
    addressLine3: {
      'ui:title': 'Street address (optional)'
    },
    city: {
      'ui:title': 'City',
    },
    state: {
      'ui:title': 'State',
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:options': {
        widgetClassNames: 'va-input-medium-large'
      }
    }
  },
  unitPhone: {
    'ui:title': 'Unit phone number',
  },
};

export const schema = {
  type: 'object',
  properties: {
    obligationTermOfServiceDateRange,
    unitName,
    unitAddress,
    unitPhone
  }
};

