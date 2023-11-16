import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import {
  validateDate,
  validateDateRange,
} from '@department-of-veterans-affairs/platform-forms-system/validation';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { ReservesGuardDescription } from '../utils';

const {
  properties: { unitName, obligationTermOfServiceDateRange },
  required,
} = fullSchema.properties.serviceInformation.properties.reservesNationalGuardService;

export const uiSchema = {
  'ui:title': 'Reserve and National Guard Information',
  'ui:description': ReservesGuardDescription,
  serviceInformation: {
    reservesNationalGuardService: {
      obligationTermOfServiceDateRange: {
        'ui:validations': [validateDateRange],
        'ui:errorMessages': {
          pattern: 'End date must be after start date',
          required: 'Please enter a date',
        },
        from: {
          'ui:title': 'Obligation start date',
          'ui:widget': 'date',
          'ui:webComponentField': VaMemorableDateField,
          'ui:validations': [validateDate],
          'ui:errorMessages': {
            pattern: 'Please enter a valid date',
            required: 'Please enter a date',
          },
        },
        to: {
          'ui:title': 'Obligation end date',
          'ui:widget': 'date',
          'ui:webComponentField': VaMemorableDateField,
          'ui:validations': [validateDate],
          'ui:errorMessages': {
            pattern: 'Please enter a valid date',
            required: 'Please enter a date',
          },
        },
      },
      unitName: {
        'ui:title': 'Unit name',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    serviceInformation: {
      type: 'object',
      properties: {
        reservesNationalGuardService: {
          type: 'object',
          required,
          properties: {
            obligationTermOfServiceDateRange,
            unitName,
          },
        },
      },
    },
  },
};
