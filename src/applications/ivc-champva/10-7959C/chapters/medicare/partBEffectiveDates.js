import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { futureDateSchema, futureDateUI } from '../../definitions';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-b-effective-date-title'];
const SUBTITLE_TEXT = content['medicare--part-b-subtitle'];
const INPUT_LABEL = content['medicare--effective-date-label'];
const HINT_TEXT = content['medicare--part-b-effective-date-hint'];

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    'view:medicarePartBEffectiveDate': {
      ...titleUI({
        title: SUBTITLE_TEXT,
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartBEffectiveDate: futureDateUI({
        title: INPUT_LABEL,
        hint: HINT_TEXT,
        classNames: 'vads-u-margin-top--neg1p5',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:medicarePartBEffectiveDate': {
        type: 'object',
        required: ['medicarePartBEffectiveDate'],
        properties: {
          medicarePartBEffectiveDate: futureDateSchema,
        },
      },
    },
  },
};
