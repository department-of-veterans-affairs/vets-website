import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { isValidDateRange } from 'platform/forms/validations';
import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidCentralMailPostalCode } from 'platform/forms/address/validations';

export default [
  // 0 -> 1, we've added some date validation and need to move users back to particular pages
  // if there are errors
  ({ formData, metadata }) => {
    // First place is active service period
    if (formData.servicePeriods) {
      const fromDate = convertToDateField(formData.veteranDateOfBirth);
      const dateError = formData.servicePeriods.some(period => {
        const toDate = convertToDateField(
          get('activeServiceDateRange.from', period),
        );

        return !isValidDateRange(fromDate, toDate);
      });

      if (dateError) {
        return {
          formData,
          metadata: set('returnUrl', '/military/history', metadata),
        };
      }
    }

    if (formData.marriages) {
      const index = formData.marriages.findIndex(marriage => {
        const fromDate = convertToDateField(marriage.dateOfMarriage);
        const toDate = convertToDateField(
          get('view:pastMarriage.dateOfSeparation', marriage),
        );

        return !isValidDateRange(fromDate, toDate);
      });

      if (index >= 0) {
        return {
          formData,
          metadata: set('returnUrl', `/household/marriages/${index}`, metadata),
        };
      }
    }

    if (formData.spouseMarriages) {
      const index = formData.spouseMarriages.findIndex(marriage => {
        const fromDate = convertToDateField(marriage.dateOfMarriage);
        const toDate = convertToDateField(marriage.dateOfSeparation);

        return !isValidDateRange(fromDate, toDate);
      });

      if (index >= 0) {
        return {
          formData,
          metadata: set(
            'returnUrl',
            `/household/spouse-marriages/${index}`,
            metadata,
          ),
        };
      }
    }
    return { formData, metadata };
  },
  // 1 > 2, move user back to address page if zip code is bad
  ({ formData, metadata }) => {
    let newMetadata = metadata;

    if (
      formData.veteranAddress &&
      !isValidCentralMailPostalCode(formData.veteranAddress)
    ) {
      newMetadata = {
        ...metadata,
        returnUrl: '/additional-information/contact',
      };
    }

    return { formData, metadata: newMetadata };
  },
  // 2 > 3, move user back to file number if incorrect
  ({ formData, metadata }) => {
    const fileNumbeRegex = /^\d{8,9}$/;
    let newMetadata = metadata;

    if (
      formData.spouseVaFileNumber &&
      !fileNumbeRegex.test(formData.spouseVaFileNumber)
    ) {
      newMetadata = { ...metadata, returnUrl: '/household/spouse-info' };
    } else if (
      formData.vaFileNumber &&
      !fileNumbeRegex.test(formData.vaFileNumber)
    ) {
      newMetadata = { ...metadata, returnUrl: '/applicant/information' };
    }

    return { formData, metadata: newMetadata };
  },
  // 3 > 4, remove fields no longer present in schema
  ({ formData, metadata }) => {
    const newFormData = { ...formData };
    const newMetadata = { ...metadata };
    const fieldsToRemove = [
      'netWorth',
      'additionalSources',
      'monthlyIncome',
      'expectedIncome',
      'otherExpenses',
      'altEmail',
      'monthlySpousePayment',
      'servicePeriods',
      'combatSince911',
      'noBankAccount',
      'nationalGuardActivation',
      'nationalGuard',
      'severancePay',
      'disabilities',
      'jobs',
      'privacyAgreementAccepted',
      'marriageHistory',
      'spouseNetWorth',
      'spouseMonthlyIncome',
      'spouseExpectedIncome',
      'spouseOtherExpenses',
      'vamcTreatmentCenters',
    ];

    if (Object.keys(formData).some(key => fieldsToRemove.includes(key))) {
      newMetadata.returnUrl = '/applicant/information';
      fieldsToRemove.forEach(fieldToRemove => {
        delete newFormData[fieldToRemove];
      });
    }

    return { formData: newFormData, metadata: newMetadata };
  },
];
