import {
  titleUI,
  descriptionUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import SpouseFinancialSupportDescription from '../../../components/FormDescriptions/SpouseFinancialSupportDescription';
import { replaceStrValues } from '../../../utils/helpers/general';
import { LAST_YEAR } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['household-spouse-support-title']),
    provideSupportLastYear: {
      'ui:title': replaceStrValues(
        content['household-spouse-support-label'],
        LAST_YEAR,
      ),
      ...descriptionUI(SpouseFinancialSupportDescription, {
        hideOnReview: true,
      }),
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      provideSupportLastYear: yesNoSchema,
    },
  },
};
