import {
  titleUI,
  descriptionUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import SpouseFinancialSupportDescription from '../../../components/SpouseFinancialSupportDescription';
import { replaceStrValues } from '../../../../../../utils/helpers/general';
import { LAST_YEAR } from '../../../../../../utils/constants';
import content from '../../../../../../shared/locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['household-spouse-support-title']),
    ...descriptionUI(SpouseFinancialSupportDescription, {
      hideOnReview: true,
    }),
    provideSupportLastYear: yesNoUI(
      replaceStrValues(content['household-spouse-support-label'], LAST_YEAR),
    ),
  },
  schema: {
    type: 'object',
    required: ['provideSupportLastYear'],
    properties: {
      provideSupportLastYear: yesNoSchema,
    },
  },
};
