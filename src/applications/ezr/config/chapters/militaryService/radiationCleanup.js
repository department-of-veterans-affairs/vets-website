import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import RadiationCleanupDescription from '../../../components/FormDescriptions/RadiationCleanupDescription';

const { radiationCleanupEfforts } = ezrSchema.properties;

export default {
  uiSchema: {
    'ui:title': 'Cleanup or response efforts',
    radiationCleanupEfforts: {
      'ui:title':
        'Did you take part in any of these clean up or response efforts while serving in any of these locations?',
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
