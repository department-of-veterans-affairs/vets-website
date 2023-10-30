import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import SpouseInfoDescription from '../../../components/FormDescriptions/SpouseInfoDescription';
import { replaceStrValues } from '../../../utils/helpers/general';
import content from '../../../locales/en/content.json';

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    ...titleUI(
      content['household-spouse-addtl-info-title'],
      SpouseInfoDescription,
    ),
    cohabitedLastYear: yesNoUI(
      replaceStrValues(content['household-spouse-cohabitate-label'], lastYear),
    ),
    sameAddress: yesNoUI(content['household-spouse-same-address-label']),
  },
  schema: {
    type: 'object',
    required: ['sameAddress'],
    properties: {
      cohabitedLastYear: yesNoSchema,
      sameAddress: yesNoSchema,
    },
  },
};
