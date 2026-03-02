import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicareOverview from '../../components/FormDescriptions/MedicareOverviewDescription';
import { blankSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--intro-title'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    ...descriptionUI(MedicareOverview),
  },
  schema: blankSchema,
};
