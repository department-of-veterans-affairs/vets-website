import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AgentOrangeExposureDescription from '../../../components/FormDescriptions/AgentOrangeExposureDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    'ui:title': content['military-service-agent-orange-locations-title'],
    exposedToAgentOrange: yesNoUI({
      title: content['military-service-agent-orange-exposed-title'],
      description: AgentOrangeExposureDescription,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      exposedToAgentOrange: yesNoSchema,
    },
  },
};
