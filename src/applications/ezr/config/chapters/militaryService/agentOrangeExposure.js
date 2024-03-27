import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import AgentOrangeExposureDescription from '../../../components/FormDescriptions/AgentOrangeExposureDescription';
import content from '../../../locales/en/content.json';

const { exposedToAgentOrange } = ezrSchema.properties;

export default {
  uiSchema: {
    'ui:title': content['military-service-agent-orange-locations-title'],
    exposedToAgentOrange: {
      'ui:title': content['military-service-agent-orange-exposed-title'],
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
