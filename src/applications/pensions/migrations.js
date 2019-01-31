import _ from 'lodash/fp';
import { isValidDateRange } from '../../platform/forms/validations';
import { convertToDateField } from 'us-forms-system/lib/js/validation';
import { isValidCentralMailPostalCode } from '../../platform/forms/address/validations';

export default [
  // 0 -> 1, we've added some date validation and need to move users back to particular pages
  // if there are errors
  ({ formData, metadata }) => {
    // First place is active service period
    if (formData.servicePeriods) {
      const fromDate = convertToDateField(formData.veteranDateOfBirth);
      const dateError = formData.servicePeriods.some(period => {
        const toDate = convertToDateField(
          _.get('activeServiceDateRange.from', period),
        );

        return !isValidDateRange(fromDate, toDate);
      });

      if (dateError) {
        return {
          formData,
          metadata: _.set('returnUrl', '/military/history', metadata),
        };
      }
    }

    if (formData.marriages) {
      const index = formData.marriages.findIndex(marriage => {
        const fromDate = convertToDateField(marriage.dateOfMarriage);
        const toDate = convertToDateField(
          _.get('view:pastMarriage.dateOfSeparation', marriage),
        );

        return !isValidDateRange(fromDate, toDate);
      });

      if (index >= 0) {
        return {
          formData,
          metadata: _.set(
            'returnUrl',
            `/household/marriages/${index}`,
            metadata,
          ),
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
          metadata: _.set(
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
      newMetadata = Object.assign({}, metadata, {
        returnUrl: '/additional-information/contact',
      });
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
      newMetadata = Object.assign({}, metadata, {
        returnUrl: '/household/spouse-info',
      });
    } else if (
      formData.vaFileNumber &&
      !fileNumbeRegex.test(formData.vaFileNumber)
    ) {
      newMetadata = Object.assign({}, metadata, {
        returnUrl: '/applicant/information',
      });
    }

    return { formData, metadata: newMetadata };
  },
];
