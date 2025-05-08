import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import currentOrPastMonthYearUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastMonthYear';
import { ServiceDateRangeDescription } from '../../../components/FormDescriptions';
import DateRangeDescription from '../../../components/FormDescriptions/DateRangeDescription';
import { validateExposureDates } from '../../../utils/validation';
import { FULL_SCHEMA } from '../../../utils/imports';
import { emptyObjectSchema } from '../../../definitions';

const { toxicExposureStartDate, toxicExposureEndDate } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      'Dates of exposure',
      'Enter any date range when you think you may have been exposed to other toxins or hazards. You don\u2019t need to have exact dates.',
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
      'ui:validations': [validateExposureDates],
    },
    'view:dateRange': {
      'ui:description': DateRangeDescription,
    },
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
