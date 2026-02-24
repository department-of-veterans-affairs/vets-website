import {
  dateOfDeathSchema,
  dateOfDeathUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['sponsor--death-info-title'];
const INPUT_LABELS = {
  dateOfDeath: content['sponsor--death-date-label'],
  deathConditions: content['sponsor--death-conditions-label'],
};
const DEATH_CONDITIONS_HINT_TEXT = content['sponsor--death-conditions-hint'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    sponsorDod: dateOfDeathUI(INPUT_LABELS.dateOfDeath),
    sponsorDeathConditions: yesNoUI({
      title: INPUT_LABELS.deathConditions,
      hint: DEATH_CONDITIONS_HINT_TEXT,
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
