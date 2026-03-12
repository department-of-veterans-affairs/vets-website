// @ts-check
import {
  titleUI,
  descriptionUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { LAST_YEAR, replaceStrValues } from '../../../utils/helpers';
import { SpouseFinancialSupportDescription } from '../../../components/FormDescriptions';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { provideSupportLastYear } = FULL_SCHEMA.properties;

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
      provideSupportLastYear,
    },
  },
};
