import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import { ServiceDateRangeDescription } from '../../../components/FormDescriptions/ServiceDateRangeDescription';
import DateRangeDescription from '../../../components/FormDescriptions/DateRangeDescription';
import { validateExposureDates } from '../../../utils/validation';
import { emptyObjectSchema } from '../../../definitions';
import content from '../../../locales/en/content.json';

const { toxicExposureStartDate, toxicExposureEndDate } = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['military-service-other-exposure-dates-title'],
      content['military-service-other-exposure-dates-description'],
    ),
    'view:toxicExposureDates': {
      toxicExposureStartDate: {
        ...currentOrPastMonthYearUI(
          content['military-service-other-exposure-dates-start'],
        ),
        'ui:description': ServiceDateRangeDescription,
      },
      toxicExposureEndDate: {
        ...currentOrPastMonthYearUI(
          content['military-service-other-exposure-dates-end'],
        ),
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
