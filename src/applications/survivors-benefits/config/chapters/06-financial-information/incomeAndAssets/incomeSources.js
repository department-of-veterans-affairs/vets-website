import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isYes } from '../../../../utils/helpers';
import { IncomeAssetStatementFormAlert } from '../../../../components/FormAlerts';

const uiSchema = {
  ...titleUI('Income sources'),
  moreThanFourIncomeSources: yesNoUI({
    title: 'Do you or your dependents have more than 4 sources of income?',
    'ui:required': true,
  }),
  incomeAssetStatementFormAlert: {
    'ui:description': IncomeAssetStatementFormAlert,
    'ui:options': {
      hideIf: formData => !isYes(formData?.moreThanFourIncomeSources),
      displayEmptyObjectOnReview: true,
    },
  },
  otherIncome: yesNoUI({
    title:
      'Other than Social Security, did you or your dependents receive any income last year that you no longer receive?',
    'ui:required': true,
  }),
  incomeAssetStatementFormAlertOtherIncome: {
    'ui:description': IncomeAssetStatementFormAlert,
    'ui:options': {
      hideIf: formData => !isYes(formData?.otherIncome),
      displayEmptyObjectOnReview: true,
    },
  },
};

const schema = {
  type: 'object',
  required: ['moreThanFourIncomeSources', 'otherIncome'],
  properties: {
    moreThanFourIncomeSources: yesNoSchema,
    incomeAssetStatementFormAlert: {
      type: 'object',
      properties: {},
    },
    otherIncome: yesNoSchema,
    incomeAssetStatementFormAlertOtherIncome: {
      type: 'object',
      properties: {},
    },
  },
};

export default {
  uiSchema,
  schema,
};
