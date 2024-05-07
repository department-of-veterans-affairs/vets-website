import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AgentOrangeExposureDescription from '../../../components/FormDescriptions/AgentOrangeExposureDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    'ui:title': content['military-service-agent-orange-locations-title'],
    exposedToAgentOrange: radioUI({
      classNames: 'custom-hide-label',
      useFormsPattern: 'single',
      formHeading: content['military-service-agent-orange-exposed-title'],
      formDescription: AgentOrangeExposureDescription,
      formHeadingLevel: 5,
      labels: {
        '1': 'Yes',
        '2': 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      exposedToAgentOrange: radioSchema(['1', '2']),
    },
  },
};
