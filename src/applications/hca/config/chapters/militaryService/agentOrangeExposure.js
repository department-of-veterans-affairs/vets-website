import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import AgentOrangeExposureDescription from '../../../components/FormDescriptions/AgentOrangeExposureDescription';
import content from '../../../locales/en/content.json';

const { exposedToAgentOrange } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['service-info--agent-orange-title']),
    exposedToAgentOrange: {
      'ui:title': content['service-info--agent-orange-label'],
      ...descriptionUI(AgentOrangeExposureDescription),
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      exposedToAgentOrange,
    },
  },
};
