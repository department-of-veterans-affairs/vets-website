import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import RadiationCleanupDescription from '../../../components/FormDescriptions/RadiationCleanupDescription';

const { radiationCleanupEfforts } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Cleanup or response efforts',
    radiationCleanupEfforts: {
      'ui:title':
        'Did you take part in any of these cleanup or response efforts?',
      'ui:description': RadiationCleanupDescription,
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      radiationCleanupEfforts,
    },
  },
};
