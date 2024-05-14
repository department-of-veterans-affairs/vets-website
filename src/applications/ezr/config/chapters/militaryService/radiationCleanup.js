import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import RadiationCleanupDescription from '../../../components/FormDescriptions/RadiationCleanupDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    'ui:title': content['military-service-radiation-exposure-title-2'],
    radiationCleanupEfforts: radioUI({
      title: content['military-service-radiation-exposure-description'],
      useFormsPattern: 'single',
      formDescription: RadiationCleanupDescription,
      labels: {
        '1': 'Yes',
        '2': 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      radiationCleanupEfforts: radioSchema(['1', '2']),
    },
  },
};
