import {
  titleUI,
  bankAccountSchema,
  bankAccountUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const updatedBankAccountSchema = bankAccountSchema();
updatedBankAccountSchema.required = [
  'bankName',
  'accountType',
  'accountNumber',
  'routingNumber',
];
updatedBankAccountSchema.properties.bankName.maxLength = 34;

function dependsIfHasBankAccount(formData) {
  return (
    formData?.hasBankAccount === true ||
    formData?.hasBankAccount === 'Y' ||
    formData?.hasBankAccount === 'yes'
  );
}

/** @type {PageSchema} */
export default {
  depends: dependsIfHasBankAccount,
  uiSchema: {
    ...titleUI('Account information for direct deposit'),
    bankAccount: bankAccountUI({
      labels: {
        routingNumberLabel: "Bank's 9-digit routing number",
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['bankAccount'],
    properties: {
      bankAccount: updatedBankAccountSchema,
    },
  },
};
