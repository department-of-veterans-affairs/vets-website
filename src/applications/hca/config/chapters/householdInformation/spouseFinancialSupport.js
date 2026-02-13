// @ts-check
import {
  titleUI,
  descriptionUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { LAST_YEAR, replaceStrValues } from '../../../utils/helpers';
import { SpouseFinancialSupportDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI('Spouse\u2019s financial support'),
    ...descriptionUI(SpouseFinancialSupportDescription),
    provideSupportLastYear: yesNoUI({
      title: replaceStrValues(
        content['household-info--spouse-support-label'],
        LAST_YEAR,
      ),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      provideSupportLastYear: yesNoSchema,
    },
  },
};
