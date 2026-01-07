import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--parts-ab-effective-date-title'];
const SUBTITLES = {
  partA: content['medicare--part-a-subtitle'],
  partB: content['medicare--part-b-subtitle'],
};

const INPUT_LABEL = content['medicare--effective-date-label'];
const HINT_TEXT = {
  partA: content['medicare--part-a-effective-date-hint'],
  partB: content['medicare--part-b-effective-date-hint'],
};

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    'view:medicarePartAEffectiveDate': {
      ...titleUI({
        title: SUBTITLES.partA,
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartAEffectiveDate: currentOrPastDateUI({
        title: INPUT_LABEL,
        hint: HINT_TEXT.partA,
        classNames: 'vads-u-margin-top--neg1p5',
      }),
    },
    'view:medicarePartBEffectiveDate': {
      ...titleUI({
        title: SUBTITLES.partB,
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartBEffectiveDate: currentOrPastDateUI({
        title: INPUT_LABEL,
        hint: HINT_TEXT.partB,
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
          medicarePartAEffectiveDate: currentOrPastDateSchema,
        },
      },
      'view:medicarePartBEffectiveDate': {
        type: 'object',
        required: ['medicarePartBEffectiveDate'],
        properties: {
          medicarePartBEffectiveDate: currentOrPastDateSchema,
        },
      },
    },
  },
};
