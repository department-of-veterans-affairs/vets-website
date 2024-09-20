import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { replaceStrValues } from '../../../../../../utils/helpers/general';
import { LAST_YEAR } from '../../../../../../utils/constants';
import content from '../../../../../../shared/locales/en/content.json';

export default {
  uiSchema: {
    disabledBefore18: yesNoUI(content['household-dependent-disabled-label']),
    cohabitedLastYear: yesNoUI(
      replaceStrValues(
        content['household-dependent-cohabitated-label'],
        LAST_YEAR,
      ),
    ),
    'view:dependentIncome': yesNoUI(
      replaceStrValues(
        content['household-dependent-earned-income-label'],
        LAST_YEAR,
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
