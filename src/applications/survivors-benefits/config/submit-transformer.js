import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { format } from 'date-fns-tz';
import { durationInDays } from '../utils/helpers';
import { separationReasonOptions } from '../utils/labels';

const usaPhoneKeys = ['phone', 'mobilePhone', 'dayPhone', 'nightPhone'];

function replacer(key, value) {
  if (usaPhoneKeys.includes(key) && value?.length) {
    return value.replace(/[^\d]/g, '');
  }

  if (value && typeof value === 'object') {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }
  }

  return value;
}

function calculateSeparationDuration(formData) {
  const transformedValue = { ...formData };
  const startDate = formData?.separationStartDate;
  const endDate = formData?.separationEndDate;

  let calculatedDuration = null;

  if (startDate && endDate) {
    calculatedDuration = durationInDays(startDate, endDate);
  }

  if (formData?.separationExplanation) {
    const originalExplanation = formData.separationExplanation;
    const additionalItems = [];

    if (formData?.separationDueToAssignedReasons) {
      const reasonKey = formData.separationDueToAssignedReasons;
      const reasonLabel = separationReasonOptions[reasonKey];
      if (reasonLabel) {
        additionalItems.push(`Reason: ${reasonLabel}`);
      }
    }

    if (startDate) {
      additionalItems.push(`Start Date: ${startDate}`);
    }

    if (endDate) {
      additionalItems.push(`End Date: ${endDate}`);
    }

    if (calculatedDuration) {
      additionalItems.push(`Duration: ${calculatedDuration} days`);
    }

    if (formData?.courtOrderedSeparation !== undefined) {
      const courtOrderValue = formData.courtOrderedSeparation ? 'Yes' : 'No';
      additionalItems.push(`Court Ordered: ${courtOrderValue}`);
    }

    const additionalInfo = additionalItems.join(' | ');

    transformedValue.separationExplanation = additionalInfo
      ? `${originalExplanation} | ${additionalInfo}`
      : originalExplanation;
  }

  return transformedValue;
}

function addBackendRequiredFields(formData) {
  const updated = { ...formData };

  if (formData.veteranSocialSecurityNumber) {
    updated.veteranSsn = formData.veteranSocialSecurityNumber.replace(
      /[^\d]/g,
      '',
    );
    delete updated.veteranSocialSecurityNumber;
  }

  if (formData.veteranVAFileNumber) {
    updated.veteranFileNumber = formData.veteranVAFileNumber;
    delete updated.veteranVAFileNumber;
  }

  if (typeof updated.veteranFileNumber === 'undefined') {
    updated.veteranFileNumber = '';
  }

  if (typeof formData.statementOfTruthCertified === 'boolean') {
    updated.privacyAgreementAccepted = formData.statementOfTruthCertified;
  }

  return updated;
}

export const transform = (formConfig, form) => {
  const transformedData = JSON.parse(
    transformForSubmit(formConfig, form, replacer),
  );
  const withDuration = calculateSeparationDuration(transformedData);
  const preparedForm = addBackendRequiredFields(withDuration);

  return JSON.stringify({
    survivorsBenefitsClaim: {
      form: JSON.stringify(preparedForm),
    },
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
};
