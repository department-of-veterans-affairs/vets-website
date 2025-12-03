import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isYes } from '../../../../utils/helpers';
import { IncomeAssetStatementFormAlert } from '../../../../components/FormAlerts';

const uiSchema = {
  ...titleUI('Income sources'),
  moreThanFourSources: yesNoUI({
    title: 'Do you or your dependents have more than 4 sources of income?',
    'ui:required': true,
  }),
  incomeAssetStatementFormAlert: {
    'ui:description': IncomeAssetStatementFormAlert,
    'ui:options': {
      hideIf: formData => !isYes(formData?.moreThanFourSources),
      displayEmptyObjectOnReview: true,
    },
  },
  otherIncomeLastYearNoLongerReceive: yesNoUI({
    title:
      'Other than Social Security, did you or your dependents receive any income last year that you no longer receive?',
    'ui:required': true,
  }),
  incomeAssetStatementFormAlertOtherIncome: {
    'ui:description': IncomeAssetStatementFormAlert,
    'ui:options': {
      hideIf: formData => !isYes(formData?.otherIncomeLastYearNoLongerReceive),
      displayEmptyObjectOnReview: true,
    },
  },
};

const schema = {
  type: 'object',
  required: ['moreThanFourSources', 'otherIncomeLastYearNoLongerReceive'],
  properties: {
    moreThanFourSources: yesNoSchema,
    incomeAssetStatementFormAlert: {
      type: 'object',
      properties: {},
    },
    otherIncomeLastYearNoLongerReceive: yesNoSchema,
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
