import {
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { futureDateSchema, futureDateUI } from '../../definitions';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-c-carrier-title'];
const INPUT_LABELS = {
  carrier: content['medicare--carrier-label'],
  effectiveDate: content['medicare--part-c-effective-date-label'],
};
const HINT_TEXT = {
  carrier: content['medicare--carrier-hint--alt'],
  effectiveDate: content['medicare--part-c-effective-date-hint'],
};

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    medicarePartCCarrier: textUI({
      title: INPUT_LABELS.carrier,
      hint: HINT_TEXT.carrier,
    }),
    medicarePartCEffectiveDate: futureDateUI({
      title: INPUT_LABELS.effectiveDate,
      hint: HINT_TEXT.effectiveDate,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartCCarrier', 'medicarePartCEffectiveDate'],
    properties: {
      medicarePartCCarrier: textSchema,
      medicarePartCEffectiveDate: futureDateSchema,
    },
  },
};
