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

function splitVaSsnField(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (parsedFormData?.veteranSocialSecurityNumber?.ssn) {
    transformedValue.veteranSocialSecurityNumber =
      parsedFormData?.veteranSocialSecurityNumber?.ssn;
  }
  if (parsedFormData?.veteranSocialSecurityNumber?.vaFileNumber) {
    transformedValue.vaFileNumber =
      parsedFormData?.veteranSocialSecurityNumber?.vaFileNumber;
    transformedValue.veteranSocialSecurityNumber = undefined;
  }
  return JSON.stringify(transformedValue);
}

function switchToInternationalPhone(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (!parsedFormData?.primaryPhone) {
    return JSON.stringify(transformedValue);
  }
  if (parsedFormData?.primaryPhone?.countryCode !== 'US') {
    const callingCode = parsedFormData.primaryPhone?.callingCode || '';
    const contact = parsedFormData.primaryPhone?.contact || '';
    transformedValue.primaryPhone.contact = `+${callingCode}-${contact}`;
  }
  return JSON.stringify(transformedValue);
}

export const transform = (formConfig, form) => {
  let transformedData = transformForSubmit(formConfig, form);
  transformedData = swapNames(transformedData);
  transformedData = splitVaSsnField(transformedData);
  transformedData = switchToInternationalPhone(transformedData);
  return JSON.stringify({
    medicalExpenseReportsClaim: {
      form: transformedData,
    },
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
};
