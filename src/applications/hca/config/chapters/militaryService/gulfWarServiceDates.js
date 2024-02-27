import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import { ServiceDateRangeDescription } from '../../../components/FormDescriptions';
import DateRangeDescription from '../../../components/FormDescriptions/DateRangeDescription';
import { validateGulfWarDates } from '../../../utils/validation';
import { emptyObjectSchema } from '../../../definitions';

const { gulfWarStartDate, gulfWarEndDate } = fullSchemaHca.properties;

export default {
  uiSchema: {
    ...titleUI(
      'Service dates for Gulf War locations',
      'Enter any date range you served in a Gulf War location. You don\u2019t need to have exact dates.',
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
    },
    'view:dateRange': {
      'ui:description': DateRangeDescription,
    },
    'ui:validations': [validateGulfWarDates],
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
