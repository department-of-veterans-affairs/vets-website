import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import merge from 'lodash/merge';
import bankAccountUI from '@department-of-veterans-affairs/platform-forms/bankAccount';
import { AccountInformationAlert } from '../../../components/FormAlerts';
import { bankAccount } from '../../definitions';
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
    bankAccount: merge({}, bankAccountUI, {
      'ui:order': ['accountType', 'bankName', 'accountNumber', 'routingNumber'],
      'ui:description':
        'Enter the details of the bank account where you want to get your VA benefit payments.',
      bankName: {
        'ui:title': 'Bank name',
      },
      accountType: {
        'ui:required': usingDirectDeposit,
      },
      accountNumber: {
        'ui:title': 'Account number',
        'ui:required': usingDirectDeposit,
      },
      routingNumber: {
        'ui:title': 'Routing number',
        'ui:required': usingDirectDeposit,
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      bankAccount,
    },
  },
};
