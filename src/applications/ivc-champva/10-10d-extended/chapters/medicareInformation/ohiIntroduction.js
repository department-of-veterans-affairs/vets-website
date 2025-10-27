import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import OhiIntroDescription from '../../components/FormDescriptions/OhiIntroDescription';
import content from '../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['ohi--section-title']),
    ...descriptionUI(OhiIntroDescription),
  },
  schema: blankSchema,
};
