import {
  descriptionUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ProofOfMedicareAlert from '../../components/FormAlerts/ProofOfMedicareAlert';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-a-denial-notice-title'];
const INPUT_LABEL = content['medicare--part-a-denial-notice-label'];
const HINT_TEXT = content['medicare--part-a-denial-notice-hint'];

export default {
  uiSchema: {
    ...descriptionUI(ProofOfMedicareAlert),
    'view:hasPartADenial': {
      ...titleWithNameUI(TITLE_TEXT),
      hasPartADenial: yesNoUI({
        title: INPUT_LABEL,
        hint: HINT_TEXT,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasPartADenial': {
        type: 'object',
        required: ['hasPartADenial'],
        properties: {
          hasPartADenial: yesNoSchema,
        },
      },
    },
  },
};
