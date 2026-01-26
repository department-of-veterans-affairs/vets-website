import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { futureDateSchema, futureDateUI } from '../../definitions';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-a-effective-date-title'];
const SUBTITLE_TEXT = content['medicare--part-a-subtitle'];
const INPUT_LABEL = content['medicare--effective-date-label'];
const HINT_TEXT = content['medicare--part-a-effective-date-hint'];

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    'view:medicarePartAEffectiveDate': {
      ...titleUI({
        title: SUBTITLE_TEXT,
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartAEffectiveDate: futureDateUI({
        title: INPUT_LABEL,
        hint: HINT_TEXT,
        classNames: 'vads-u-margin-top--neg1p5',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:medicarePartAEffectiveDate': {
        type: 'object',
        required: ['medicarePartAEffectiveDate'],
        properties: {
          medicarePartAEffectiveDate: futureDateSchema,
        },
      },
    },
  },
};
