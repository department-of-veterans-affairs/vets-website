import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import OtherHealthInsuranceDescription from '../../components/FormDescriptions/OtherHealthInsuranceDescription';
import content from '../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['ohi--section-title']),
    ...descriptionUI(OtherHealthInsuranceDescription),
  },
  schema: blankSchema,
};
