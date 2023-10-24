import ezrSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import SpouseFinancialSupportDescription from '../../../components/FormDescriptions/SpouseFinancialSupportDescription';
import { replaceStrValues } from '../../../utils/helpers/general';
import content from '../../../locales/en/content.json';

const { provideSupportLastYear } = ezrSchema.properties;

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    ...titleUI(content['household-spouse-support-title']),
    provideSupportLastYear: {
      'ui:title': replaceStrValues(
        content['household-spouse-support-label'],
        lastYear,
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
      provideSupportLastYear,
    },
  },
};
