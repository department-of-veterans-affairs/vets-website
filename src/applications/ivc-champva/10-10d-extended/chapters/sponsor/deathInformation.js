import {
  dateOfDeathSchema,
  dateOfDeathUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { capitalizeFirst } from '../../utils/helpers';

const TITLE_TEXT = 'Details about the Veteran’s death';
const INPUT_LABELS = {
  dateOfDeath: 'When did the Veteran die?',
  deathConditions: 'Did the Veteran die during active military service?',
};
const DEATH_CONDITIONS_HINT_TEXT =
  'Depending on your response, you may need to submit additional documents.';

const SCHEMA_ENUM = ['yes', 'no'];
const SCHEMA_LABELS = Object.fromEntries(
  SCHEMA_ENUM.map(key => [key, capitalizeFirst(key)]),
);

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    sponsorDod: dateOfDeathUI(INPUT_LABELS.dateOfDeath),
    sponsorDeathConditions: yesNoUI({
      title: INPUT_LABELS.deathConditions,
      hint: DEATH_CONDITIONS_HINT_TEXT,
      labels: SCHEMA_LABELS,
    }),
  },
  schema: {
    type: 'object',
    required: ['sponsorDod', 'sponsorDeathConditions'],
    properties: {
      sponsorDod: dateOfDeathSchema,
      sponsorDeathConditions: yesNoSchema,
    },
  },
};
