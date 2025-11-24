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

  // Alter fullNameRecipient to recipientName in careExpenses
  if (Array.isArray(transformedValue.careExpenses)) {
    transformedValue.careExpenses = transformedValue.careExpenses.map(
      expense => {
        if (!expense.fullNameRecipient) return expense;
        const { recipient, fullNameRecipient, ...rest } = expense;
        return { recipient, recipientName: fullNameRecipient, ...rest };
      },
    );
  }

  // Alter fullNameRecipient to recipientName in medicalExpenses
  if (Array.isArray(transformedValue.medicalExpenses)) {
    transformedValue.medicalExpenses = transformedValue.medicalExpenses.map(
      expense => {
        if (!expense.fullNameRecipient) return expense;
        const { recipient, fullNameRecipient, ...rest } = expense;
        return { recipient, recipientName: fullNameRecipient, ...rest };
      },
    );
  }

  // Alter fullNameTraveler to travelerName in mileageExpense
  if (Array.isArray(transformedValue.mileageExpenses)) {
    transformedValue.mileageExpenses = transformedValue.mileageExpenses.map(
      expense => {
        if (!expense.fullNameTraveler) return expense;
        const { traveler, fullNameTraveler, ...rest } = expense;
        return { traveler, travelerName: fullNameTraveler, ...rest };
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
