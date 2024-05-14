import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AgentOrangeExposureDescription from '../../../components/FormDescriptions/AgentOrangeExposureDescription';
import content from '../../../locales/en/content.json';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': content['military-service-agent-orange-locations-title'],
    exposedToAgentOrange: radioUI({
      useFormsPattern: 'single',
      title: content['military-service-agent-orange-exposed-title'],
      formDescription: AgentOrangeExposureDescription,
      labels: {
        '1': 'Yes',
        '2': 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    // required: ['exposedToAgentOrange'],
    properties: {
      exposedToAgentOrange: radioSchema(['1', '2']),
    },
  },
};
