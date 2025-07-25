import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import { ServiceDateRangeDescription } from '../../../components/FormDescriptions';
import DateRangeDescription from '../../../components/FormDescriptions/DateRangeDescription';
import { validateExposureDates } from '../../../utils/validation';
import { FULL_SCHEMA } from '../../../utils/imports';
import { emptyObjectSchema } from '../../../definitions';
import content from '../../../locales/en/content.json';

const { toxicExposureStartDate, toxicExposureEndDate } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['service-info--exposure-date-title'],
      content['service-info--exposure-date-description'],
    ),
    'view:toxicExposureDates': {
      toxicExposureStartDate: {
        ...currentOrPastMonthYearUI('Exposure start date'),
        ...descriptionUI(ServiceDateRangeDescription),
      },
      toxicExposureEndDate: {
        ...currentOrPastMonthYearUI('Exposure end date'),
        ...descriptionUI(ServiceDateRangeDescription),
      },
      'ui:validations': [validateExposureDates],
    },
    'view:dateRange': {
      ...descriptionUI(DateRangeDescription),
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
