// @ts-check
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import RadiationCleanupDescription from '../../../components/FormDescriptions/RadiationCleanupDescription';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { radiationCleanupEfforts } = FULL_SCHEMA.properties;

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
      radiationCleanupEfforts,
    },
  },
};
