import { FULL_SCHEMA } from '../../../utils/imports';
import AgentOrangeExposureDescription from '../../../components/FormDescriptions/AgentOrangeExposureDescription';

const { exposedToAgentOrange } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:title': 'Agent Orange locations',
    exposedToAgentOrange: {
      'ui:title':
        'Did you serve in any of these locations where the military used the herbicide Agent Orange?',
      'ui:description': AgentOrangeExposureDescription,
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
