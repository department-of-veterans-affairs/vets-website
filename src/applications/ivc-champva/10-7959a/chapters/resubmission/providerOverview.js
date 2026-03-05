import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ProviderInfoDescription from '../../components/FormDescriptions/ProviderInfoDescription';
import { blankSchema } from '../../definitions';
import content from '../../locales/en/content.json';
import { personalizeTitleByRole } from '../../utils/helpers';

const TITLE_TEXT = content['resubmission--provider-overview-title'];

export default {
  uiSchema: {
    ...titleUI(({ formData }) => personalizeTitleByRole(formData, TITLE_TEXT)),
    ...descriptionUI(ProviderInfoDescription),
  },
  schema: blankSchema,
};
