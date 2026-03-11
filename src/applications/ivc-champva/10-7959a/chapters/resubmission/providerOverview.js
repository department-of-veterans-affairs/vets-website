import { descriptionUI } from 'platform/forms-system/src/js/web-component-patterns';
import ProviderInfoDescription from '../../components/FormDescriptions/ProviderInfoDescription';
import { blankSchema } from '../../definitions';
import content from '../../locales/en/content.json';
import { titleWithRoleUI } from '../../utils/titles';

const TITLE_TEXT = content['resubmission--provider-overview-title'];

export default {
  uiSchema: {
    ...titleWithRoleUI(TITLE_TEXT),
    ...descriptionUI(ProviderInfoDescription),
  },
  schema: blankSchema,
};
