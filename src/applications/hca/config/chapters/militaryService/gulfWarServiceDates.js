import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import { ServiceDateRangeDescription } from '../../../components/FormDescriptions';
import DateRangeDescription from '../../../components/FormDescriptions/DateRangeDescription';
import { validateGulfWarDates } from '../../../utils/validation';
import { FULL_SCHEMA } from '../../../utils/imports';
import { emptyObjectSchema } from '../../../definitions';

const { gulfWarStartDate, gulfWarEndDate } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      'Service dates after August 2, 1990',
      'Enter any date range you served in a Gulf War location on or after August 2, 1990. You don\u2019t need to have exact dates.',
    ),
    'view:gulfWarServiceDates': {
      gulfWarStartDate: {
        ...currentOrPastMonthYearUI('Service start date'),
        'ui:description': ServiceDateRangeDescription,
      },
      gulfWarEndDate: {
        ...currentOrPastMonthYearUI('Service end date'),
        'ui:description': ServiceDateRangeDescription,
      },
      'ui:validations': [validateGulfWarDates],
    },
    'view:dateRange': {
      'ui:description': DateRangeDescription,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:gulfWarServiceDates': {
        type: 'object',
        properties: {
          gulfWarStartDate,
          gulfWarEndDate,
        },
      },
      'view:dateRange': emptyObjectSchema,
    },
  },
};
