import {
  bankAccountUI,
  bankAccountSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AccountInformationAlert } from '../../../components/FormAlerts';
import { usingDirectDeposit } from './helpers';

const uiSchema = {
  ...titleUI('Account information for direct deposit', AccountInformationAlert),
  bankAccount: bankAccountUI({
    labels: {
      accountNumberLabel: 'Account number',
      routingNumberLabel: 'Routing number',
    },
  }),
};

const schema = {
  type: 'object',
  properties: {
    bankAccount: bankAccountSchema(),
  },
};

export default {
  depends: usingDirectDeposit,
  uiSchema,
  schema,
};
