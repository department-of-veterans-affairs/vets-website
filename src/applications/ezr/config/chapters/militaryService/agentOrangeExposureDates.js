import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import ServiceDateRangeDescription from '../../../components/FormDescriptions/ServiceDateRangeDescription';
import DateRangeDescription from '../../../components/FormDescriptions/DateRangeDescription';
import { validateAgentOrangeExposureDates } from '../../../utils/validation';
import { emptyObjectSchema } from '../../../definitions';

const { agentOrangeStartDate, agentOrangeEndDate } = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(
      'Service dates for Agent Orange locations',
      'Enter any date range you served in a location where the military used Agent Orange. You don\u2019t need to have exact dates.',
    ),
    'view:agentOrangeExposureDates': {
      agentOrangeStartDate: {
        ...currentOrPastMonthYearUI('Service start date'),
        'ui:description': ServiceDateRangeDescription,
      },
      agentOrangeEndDate: {
        ...currentOrPastMonthYearUI('Service end date'),
        'ui:description': ServiceDateRangeDescription,
      },
      'ui:validations': [validateAgentOrangeExposureDates],
    },
    'view:dateRange': {
      'ui:description': DateRangeDescription,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:agentOrangeExposureDates': {
        type: 'object',
        properties: {
          agentOrangeStartDate,
          agentOrangeEndDate,
        },
      },
      'view:dateRange': emptyObjectSchema,
    },
  },
};
