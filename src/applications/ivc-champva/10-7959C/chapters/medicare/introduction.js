import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicareIntroDescription from '../../components/FormDescriptions/MedicareIntroDescription';
import { blankSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--intro-title'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    ...descriptionUI(MedicareIntroDescription),
  },
  schema: blankSchema,
};
