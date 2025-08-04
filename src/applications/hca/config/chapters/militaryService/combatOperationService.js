import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import CombatOperationServiceDescription from '../../../components/FormDescriptions/CombatOperationServiceDescription';
import content from '../../../locales/en/content.json';

const { combatOperationService } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['service-info--operations-title']),
    combatOperationService: {
      'ui:title': content['service-info--operations-label'],
      ...descriptionUI(CombatOperationServiceDescription),
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      combatOperationService,
    },
  },
};
