import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { replaceStrValues } from '../../../utils/helpers/general';
import content from '../../../locales/en/content.json';

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    disabledBefore18: yesNoUI(content['household-dependent-disabled-label']),
    cohabitedLastYear: yesNoUI(
      replaceStrValues(
        content['household-dependent-cohabitated-label'],
        lastYear,
      ),
    ),
    'view:dependentIncome': yesNoUI(
      replaceStrValues(
        content['household-dependent-earned-income-label'],
        lastYear,
      ),
    ),
  },
  schema: {
    type: 'object',
    required: ['disabledBefore18', 'cohabitedLastYear', 'view:dependentIncome'],
    properties: {
      disabledBefore18: yesNoSchema,
      cohabitedLastYear: yesNoSchema,
      'view:dependentIncome': yesNoSchema,
    },
  },
};
