// @ts-check
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import CombatOperationServiceDescription from '../../../components/FormDescriptions/CombatOperationServiceDescription';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { combatOperationService } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['service-info--operations-title']),
    combatOperationService: yesNoUI({
      title: content['service-info--operations-label'],
      description: CombatOperationServiceDescription,
      headerAriaDescribedby: content['service-info--operations-aria-label'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      combatOperationService,
    },
  },
};
