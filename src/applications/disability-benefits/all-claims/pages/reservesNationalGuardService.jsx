import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateUI from '@department-of-veterans-affairs/platform-forms-system/date';
import { validateDateRange } from '@department-of-veterans-affairs/platform-forms-system/validation';
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
        from: dateUI('Obligation start date'),
        to: dateUI('Obligation end date'),
      },
      unitName: { 'ui:title': 'Unit name' },
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
