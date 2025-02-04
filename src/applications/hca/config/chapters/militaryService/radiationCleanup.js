import { FULL_SCHEMA } from '../../../utils/imports';
import RadiationCleanupDescription from '../../../components/FormDescriptions/RadiationCleanupDescription';

const { radiationCleanupEfforts } = FULL_SCHEMA.properties;

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
