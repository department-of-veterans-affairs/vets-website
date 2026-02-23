// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AgentOrangeExposureDescription from '../../../components/FormDescriptions/AgentOrangeExposureDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['service-info--agent-orange-title']),
    exposedToAgentOrange: yesNoUI({
      title: content['service-info--agent-orange-label'],
      description: AgentOrangeExposureDescription,
      headerAriaDescribedby: content['service-info--agent-orange-aria-label'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      exposedToAgentOrange: yesNoSchema,
    },
  },
};
