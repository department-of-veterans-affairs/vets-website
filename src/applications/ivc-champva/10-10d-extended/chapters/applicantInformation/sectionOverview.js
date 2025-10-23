import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import AddApplicantsDescription from '../../components/FormDescriptions/AddApplicantsDescription';
import { blankSchema } from '../../definitions';
import content from '../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['applicants--intro-title']),
    ...descriptionUI(AddApplicantsDescription),
  },
  schema: blankSchema,
};
