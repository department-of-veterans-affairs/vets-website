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
      content['military-service-gulf-war-service-date-title'],
      content['military-service-gulf-war-service-date-description'],
    ),
    'view:gulfWarServiceDates': {
      gulfWarStartDate: {
        ...currentOrPastMonthYearUI(
          content['military-service-gulf-war-start-date'],
        ),
        'ui:description': ServiceDateRangeDescription,
      },
      gulfWarEndDate: {
        ...currentOrPastMonthYearUI(
          content['military-service-gulf-war-end-date'],
        ),
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
