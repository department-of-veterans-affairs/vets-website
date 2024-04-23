import {
  bankAccountUI,
  bankAccountSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AccountInformationAlert } from '../../../components/FormAlerts';
import { usingDirectDeposit } from './helper';

export default {
  title: 'Account information for direct deposit',
  path: 'additional-information/account-information',
  initialData: {},
  depends: usingDirectDeposit,
  uiSchema: {
    ...titleUI(
      'Account information for direct deposit',
      AccountInformationAlert,
    ),
    bankAccount: bankAccountUI({
      labels: {
        accountNumberLabel: 'Account number',
        routingNumberLabel: 'Routing number',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      bankAccount: bankAccountSchema(),
    },
  },
};
