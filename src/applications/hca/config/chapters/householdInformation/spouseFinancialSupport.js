import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { LAST_YEAR, replaceStrValues } from '../../../utils/helpers';
import { FULL_SCHEMA } from '../../../utils/imports';
import { SpouseFinancialSupportDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

const { provideSupportLastYear } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI('Spouse\u2019s financial support'),
    ...descriptionUI(SpouseFinancialSupportDescription),
    provideSupportLastYear: {
      'ui:title': replaceStrValues(
        content['household-info--spouse-support-label'],
        LAST_YEAR,
      ),
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      provideSupportLastYear,
    },
  },
};
