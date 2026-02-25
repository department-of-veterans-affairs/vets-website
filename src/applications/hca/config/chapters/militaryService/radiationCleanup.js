// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import RadiationCleanupDescription from '../../../components/FormDescriptions/RadiationCleanupDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['service-info--radiation-title']),
    radiationCleanupEfforts: yesNoUI({
      title: content['service-info--radiation-label'],
      description: RadiationCleanupDescription,
      headerAriaDescribedby: content['service-info--radiation-aria-label'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      radiationCleanupEfforts: yesNoSchema,
    },
  },
};
