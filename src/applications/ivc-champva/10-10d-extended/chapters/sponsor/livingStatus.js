import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { capitalizeFirst } from '../../utils/helpers';

const TITLE_TEXT = 'Veteran’s status';
const DESC_TEXT =
  'If the Veteran died, we’ll ask more questions about those details. Answer to the best of your knowledge.';
const INPUT_LABEL = 'Has the Veteran died?';

const SCHEMA_ENUM = ['yes', 'no'];
const SCHEMA_LABELS = Object.fromEntries(
  SCHEMA_ENUM.map(key => [key, capitalizeFirst(key)]),
);

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, DESC_TEXT),
    sponsorIsDeceased: yesNoUI({
      title: INPUT_LABEL,
      labels: SCHEMA_LABELS,
    }),
  },
  schema: {
    type: 'object',
    required: ['sponsorIsDeceased'],
    properties: {
      sponsorIsDeceased: yesNoSchema,
    },
  },
};
