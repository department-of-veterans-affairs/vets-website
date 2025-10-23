import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import { ServiceDateRangeDescription } from '../../../components/FormDescriptions';
import DateRangeDescription from '../../../components/FormDescriptions/DateRangeDescription';
import { validateGulfWarDates } from '../../../utils/validation';
import { FULL_SCHEMA } from '../../../utils/imports';
import { emptyObjectSchema } from '../../../definitions';
import content from '../../../locales/en/content.json';

const { gulfWarStartDate, gulfWarEndDate } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['service-info--gulf-war-service-title'],
      content['service-info--gulf-war-service-description'],
    ),
    'view:gulfWarServiceDates': {
      gulfWarStartDate: {
        ...descriptionUI(ServiceDateRangeDescription),
        ...currentOrPastMonthYearUI(
          content['service-info--service-start-date-label'],
        ),
      },
      gulfWarEndDate: {
        ...descriptionUI(ServiceDateRangeDescription),
        ...currentOrPastMonthYearUI(
          content['service-info--service-end-date-label'],
        ),
      },
      'ui:validations': [validateGulfWarDates],
    },
    'view:dateRange': {
      ...descriptionUI(DateRangeDescription),
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
