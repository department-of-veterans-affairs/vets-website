import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import { ReservesGuardDescription } from '../utils';

const {
  properties: { unitName, obligationTermOfServiceDateRange },
  required,
} = fullSchema.properties.serviceInformation.properties.reservesNationalGuardService;

export const uiSchema = {
  'ui:title': 'Reserves and National Guard Information',
  'ui:description': ReservesGuardDescription,
  serviceInformation: {
    reservesNationalGuardService: {
      obligationTermOfServiceDateRange: dateRangeUI(
        'Obligation start date',
        'Obligation end date',
        'End date must be after start date',
      ),
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
