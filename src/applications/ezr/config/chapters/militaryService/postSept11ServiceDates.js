import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import { ServiceDateRangeDescription } from '../../../components/FormDescriptions/ServiceDateRangeDescription';
import DateRangeDescription from '../../../components/FormDescriptions/DateRangeDescription';
import { validateGulfWarDates } from '../../../utils/validation';
import { emptyObjectSchema } from '../../../definitions';
import content from '../../../locales/en/content.json';

const { gulfWarStartDate, gulfWarEndDate } = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['military-service-post-sept11-dates-title'],
      content['military-service-post-sept11-dates-description'],
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
