import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ReportMedicareDescription from '../../components/FormDescriptions/ReportMedicareDescription';
import content from '../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['ohi--section-title']),
    ...descriptionUI(ReportMedicareDescription),
  },
  schema: blankSchema,
};
