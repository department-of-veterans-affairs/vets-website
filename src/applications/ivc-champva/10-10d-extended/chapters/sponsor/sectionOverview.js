import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from '../../definitions';
import VeteranInformationDescription from '../../components/FormDescriptions/VeteranInformationDescription';

const TITLE_TEXT = 'Veteran information';

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    ...descriptionUI(VeteranInformationDescription),
  },
  schema: blankSchema,
};
