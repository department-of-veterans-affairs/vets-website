import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import RadiationCleanupDescription from '../../../components/FormDescriptions/RadiationCleanupDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    'ui:title': content['military-service-radiation-exposure-title-2'],
    radiationCleanupEfforts: yesNoUI({
      title: content['military-service-radiation-exposure-description'],
      description: RadiationCleanupDescription,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      radiationCleanupEfforts: yesNoSchema,
    },
  },
};
