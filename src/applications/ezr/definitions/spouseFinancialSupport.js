import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import SpouseFinancialSupportDescription from '../components/FormDescriptions/SpouseFinancialSupportDescription';
import { replaceStrValues } from '../utils/helpers/general';
import { LAST_YEAR } from '../utils/constants';
import content from '../locales/en/content.json';

const spouseFinancialSupportPage = () => ({
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      content['household-spouse-support-title'],
    ),
    ...descriptionUI(SpouseFinancialSupportDescription, {
      hideOnReview: true,
    }),
    provideSupportLastYear: yesNoUI(
      replaceStrValues(content['household-spouse-support-label'], LAST_YEAR),
    ),
  },
  schema: {
    type: 'object',
    properties: {
      provideSupportLastYear: yesNoSchema,
    },
    required: ['provideSupportLastYear'],
  },
});

export default spouseFinancialSupportPage;
