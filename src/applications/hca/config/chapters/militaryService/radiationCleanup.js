import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import RadiationCleanupDescription from '../../../components/FormDescriptions/RadiationCleanupDescription';
import content from '../../../locales/en/content.json';

const { radiationCleanupEfforts } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['service-info--radiation-title']),
    radiationCleanupEfforts: {
      'ui:title': content['service-info--radiation-label'],
      ...descriptionUI(RadiationCleanupDescription),
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
