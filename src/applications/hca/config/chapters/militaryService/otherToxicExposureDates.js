import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import { ServiceDateRangeDescription } from '../../../components/FormDescriptions';
import DateRangeDescription from '../../../components/FormDescriptions/DateRangeDescription';
import { validateExposureDates } from '../../../utils/validation';
import { emptyObjectSchema } from '../../../definitions';

const {
  toxicExposureStartDate,
  toxicExposureEndDate,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    ...titleUI(
      'Dates of exposure',
      'Enter any date range when you were exposed to other toxins or hazards. You don\u2019t need to have exact dates.',
    ),
    'view:toxicExposureDates': {
      toxicExposureStartDate: {
        ...currentOrPastMonthYearUI('Exposure start date'),
        'ui:description': ServiceDateRangeDescription,
      },
      toxicExposureEndDate: {
        ...currentOrPastMonthYearUI('Exposure end date'),
        'ui:description': ServiceDateRangeDescription,
      },
    },
    'view:dateRange': {
      'ui:description': DateRangeDescription,
    },
    'ui:validations': [validateExposureDates],
  },
  schema: {
    type: 'object',
    properties: {
      'view:toxicExposureDates': {
        type: 'object',
        properties: {
          toxicExposureStartDate,
          toxicExposureEndDate,
        },
      },
      'view:dateRange': emptyObjectSchema,
    },
  },
};
