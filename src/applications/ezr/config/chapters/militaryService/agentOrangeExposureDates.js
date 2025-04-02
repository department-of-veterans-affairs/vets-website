import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import { ServiceDateRangeDescription } from '../../../components/FormDescriptions/ServiceDateRangeDescription';
import DateRangeDescription from '../../../components/FormDescriptions/DateRangeDescription';
import { validateAgentOrangeExposureDates } from '../../../utils/validation';
import { emptyObjectSchema } from '../../../definitions';
import content from '../../../locales/en/content.json';

const { agentOrangeStartDate, agentOrangeEndDate } = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['military-service-agent-orange-service-date-title'],
      content['military-service-agent-orange-service-date-description'],
    ),
    'view:agentOrangeExposureDates': {
      agentOrangeStartDate: {
        ...currentOrPastMonthYearUI(
          content['military-service-agent-orange-start-date'],
        ),
        'ui:description': ServiceDateRangeDescription,
      },
      agentOrangeEndDate: {
        ...currentOrPastMonthYearUI(
          content['military-service-agent-orange-end-date'],
        ),
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
