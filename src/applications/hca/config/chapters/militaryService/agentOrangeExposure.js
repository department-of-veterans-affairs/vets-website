import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import AgentOrangeExposureDescription from '../../../components/FormDescriptions/AgentOrangeExposureDescription';

const { exposedToAgentOrange } = fullSchemaHca.properties;

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
