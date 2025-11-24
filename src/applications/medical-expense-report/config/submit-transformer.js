import { format } from 'date-fns-tz';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

function swapNames(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;

  // Swap claimant and veteran names if claimant is veteran
  if (
    parsedFormData?.claimantNotVeteran === false &&
    parsedFormData.claimantFullName?.first &&
    parsedFormData.claimantFullName?.last &&
    !parsedFormData.veteranFullName?.first &&
    !parsedFormData.veteranFullName?.last
  ) {
    transformedValue.veteranFullName = {};
    transformedValue.veteranFullName.first =
      parsedFormData.claimantFullName?.first;
    transformedValue.veteranFullName.middle =
      parsedFormData.claimantFullName?.middle;
    transformedValue.veteranFullName.last =
      parsedFormData.claimantFullName?.last;
    transformedValue.veteranFullName.suffix =
      parsedFormData.claimantFullName?.suffix;
    transformedValue.claimantFullName = {};
  }

  // Convert fullNameRecipient to recipientName in careExpenses array
  if (Array.isArray(transformedValue.careExpenses)) {
    transformedValue.careExpenses = transformedValue.careExpenses.map(
      expense => {
        if (!expense.fullNameRecipient) return expense;
        const { fullNameRecipient, ...rest } = expense;
        return { ...rest, recipientName: fullNameRecipient };
      },
    );
  }

  // Convert fullNameRecipient to recipientName in medicalExpenses array
  if (Array.isArray(transformedValue.medicalExpenses)) {
    transformedValue.medicalExpenses = transformedValue.medicalExpenses.map(
      expense => {
        if (!expense.fullNameRecipient) return expense;
        const { fullNameRecipient, ...rest } = expense;
        return { ...rest, recipientName: fullNameRecipient };
      },
    );
  }

  // Convert fullNameTraveler to travelerName in mileage array
  if (Array.isArray(transformedValue.mileageExpenses)) {
    transformedValue.mileageExpenses = transformedValue.mileageExpenses.map(
      expense => {
        if (!expense.fullNameTraveler) return expense;
        const { fullNameTraveler, ...rest } = expense;
        return { ...rest, travelerName: fullNameTraveler };
      },
    );
  }

  return JSON.stringify(transformedValue);
}

export const transform = (formConfig, form) => {
  let transformedData = transformForSubmit(formConfig, form);
  transformedData = swapNames(transformedData);
  return JSON.stringify({
    medicalExpenseReportsClaim: {
      form: transformedData,
    },
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
};
