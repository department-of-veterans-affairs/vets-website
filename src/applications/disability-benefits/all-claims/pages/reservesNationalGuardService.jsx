import fullSchema from '../config/schema';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
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
