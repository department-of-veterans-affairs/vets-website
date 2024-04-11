import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import RadiationCleanupDescription from '../../../components/FormDescriptions/RadiationCleanupDescription';
import content from '../../../locales/en/content.json';

const { radiationCleanupEfforts } = ezrSchema.properties;

export default {
  uiSchema: {
    'ui:title': content['military-service-radiation-exposure-title-2'],
    radiationCleanupEfforts: {
      'ui:title': content['military-service-radiation-exposure-description'],
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
