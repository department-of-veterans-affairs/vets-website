import {
  titleUI,
  bankAccountSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { bankAccountUI } from 'platform/forms-system/src/js/web-component-patterns/bankPattern';
import { bankAccountTypeOptions } from '../../../utils/labels';

const { CHECKING, SAVINGS } = bankAccountTypeOptions;

function dependsIfHasBankAccount(formData) {
  return (
    formData?.hasBankAccount === true ||
    formData?.hasBankAccount === 'Y' ||
    formData?.hasBankAccount === 'yes'
  );
}

const baseBankUI = bankAccountUI({
  labels: {
    routingNumberLabel: "Bank's 9-digit routing number",
  },
});

const uiSchema = {
  ...titleUI('Account information for direct deposit'),
  ...baseBankUI,
  accountType: radioUI({
    title: 'Account type',
    classNames: 'vads-u-margin-bottom--2',
    labels: {
      CHECKING,
      SAVINGS,
    },
  }),
};

const baseBankSchema = bankAccountSchema();
baseBankSchema.properties.accountType = radioSchema(
  Object.keys(bankAccountTypeOptions),
);

const schema = baseBankSchema;

export default {
  depends: dependsIfHasBankAccount,
  uiSchema,
  schema,
};
