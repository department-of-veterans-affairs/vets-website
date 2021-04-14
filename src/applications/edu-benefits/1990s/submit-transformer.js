import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import _ from 'lodash';

export function transform(formConfig, form) {
  const directDepositTransform = formData => {
    let clonedData = _.cloneDeep(formData);
    delete clonedData['view:directDeposit'].declineDirectDeposit;

    const bankAccount = clonedData['view:DirectDeposit'].bankAccount;
    const originalBankAccount = clonedData['view:originalBankAccount'];
    const { accountType, accountNumber, routingNumber } = bankAccount;
    const originalAccountType = originalBankAccount['view:accountType'];
    const originalAccountNumber = originalBankAccount['view:accountNumber'];
    const originalRoutingNumber = originalBankAccount['view:routingNumber'];

    if (bankAccount['view:hasPrefilledBank']) {
      delete clonedData['view:DirectDeposit'].bankAccount;
      clonedData = {
        ...clonedData,
        'view:directDeposit': {
          ...clonedData['view:directDeposit'],
          bankAccount: {
            accountType: accountType || originalAccountType?.toLowerCase(),
            accountNumber: accountNumber || originalAccountNumber,
            routingNumber: routingNumber || originalRoutingNumber,
          },
        },
      };
    }

    return clonedData;
  };

  const reviewPageTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    delete clonedData.AGREED;

    return clonedData;
  };

  // This needs to be last function call in array below
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    directDepositTransform,
    reviewPageTransform,
    usFormTransform, // This needs to be last function call in array
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
