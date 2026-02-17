import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { isValidDateRange } from 'platform/forms/validations';
import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidCentralMailPostalCode } from 'platform/forms/address/validations';

const deleteArrayValue = (array = [], path = []) => {
  const key = path.pop();
  array.forEach(item => {
    const container = get(path.join('.'), item);
    if (container) {
      delete container[key];
    }
  });
};

const updateCanadianAddress = address => {
  if (address?.country !== 'CAN') {
    return address;
  }
  if (address?.state === 'NF') {
    return { ...address, state: 'NL' };
  }
  if (address?.state === 'NV') {
    return { ...address, state: 'NS' };
  }
  return address;
};

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
  // 4 > 5, transform fields to new values
  ({ formData, metadata }) => {
    /**
     * @typedef {object} MarriageProps
     * @property {object} view:pastMarriage - Past marriage details
     * @property {string} view:pastMarriage.reasonForSeparation - Reason for separation
     * @property {object} view:currentMarriage - Current marriage details
     * @property {string} view:currentMarriage.marriageType - Type of marriage
     *
     * @param {MarriageProps} marriage - The marriage object to transform
     * @returns {MarriageProps} - transformed marriage object
     */
    function transformMarriage(marriage) {
      const transformedMarriage = { ...marriage };
      if (
        transformedMarriage['view:pastMarriage'] &&
        transformedMarriage['view:pastMarriage'].reasonForSeparation
      ) {
        switch (transformedMarriage['view:pastMarriage'].reasonForSeparation) {
          case "Spouse's death":
          case 'Spouse’s death':
            transformedMarriage['view:pastMarriage'].reasonForSeparation =
              'DEATH';
            break;
          case 'Divorce':
            transformedMarriage['view:pastMarriage'].reasonForSeparation =
              'DIVORCE';
            break;
          case 'Other':
            transformedMarriage['view:pastMarriage'].reasonForSeparation =
              'OTHER';
            break;
          default:
            break;
        }
      }
      if (
        transformedMarriage['view:currentMarriage'] &&
        transformedMarriage['view:currentMarriage'].marriageType
      ) {
        switch (transformedMarriage['view:currentMarriage'].marriageType) {
          case 'In a civil or religious ceremony with an officiant who signed my marriage license':
            transformedMarriage['view:currentMarriage'].marriageType =
              'CEREMONIAL';
            break;
          case 'Some other way':
            transformedMarriage['view:currentMarriage'].marriageType = 'OTHER';
            break;
          default:
            break;
        }
      }
      return transformedMarriage;
    }

    /**
     * @typedef {object} DependentProps
     * @property {string} childRelationship - Relationship of the child
     *
     * @param {DependentProps} dependent - The dependent object to transform
     * @returns {DependentProps} - transformed dependent object
     */
    function transformDependent(dependent) {
      const transformedDependent = { ...dependent };
      if (transformedDependent.childRelationship) {
        switch (transformedDependent.childRelationship) {
          case 'biological':
            transformedDependent.childRelationship = 'BIOLOGICAL';
            break;
          case 'adopted':
            transformedDependent.childRelationship = 'ADOPTED';
            break;
          case 'stepchild':
            transformedDependent.childRelationship = 'STEP_CHILD';
            break;
          default:
            break;
        }
      }
      return transformedDependent;
    }

    /**
     * @typedef {object} ExpenseProps
     * @property {string} recipients - Recipients of the expense
     * @property {number|string} hoursPerWeek - Hours per week for the expense
     *
     * @param {ExpenseProps} expense - The expense object to transform
     * @returns {ExpenseProps} - transformed expense object
     */
    function transformExpense(expense) {
      const transformedExpense = { ...expense };
      if (transformedExpense.recipients === 'CHILD') {
        transformedExpense.recipients = 'DEPENDENT';
      }
      if (transformedExpense.hoursPerWeek) {
        transformedExpense.hoursPerWeek =
          transformedExpense.hoursPerWeek.toString();
      }
      return transformedExpense;
    }

    const newFormData = {
      ...formData,
      ...(formData.marriages && {
        marriages: formData.marriages.map(m => transformMarriage(m)),
      }),
      ...(formData.dependents && {
        dependents: formData.dependents.map(d => transformDependent(d)),
      }),
      ...(formData.careExpenses && {
        careExpenses: formData.careExpenses.map(e => transformExpense(e)),
      }),
      ...(formData.medicalExpenses && {
        medicalExpenses: formData.medicalExpenses.map(e => transformExpense(e)),
      }),
    };

    if (newFormData.maritalStatus) {
      switch (newFormData.maritalStatus) {
        case 'Married':
          newFormData.maritalStatus = 'MARRIED';
          break;
        case 'Never Married':
          newFormData.maritalStatus = 'NEVER_MARRIED';
          break;
        case 'Separated':
          newFormData.maritalStatus = 'SEPARATED';
          break;
        case 'Widowed':
          newFormData.maritalStatus = 'WIDOWED';
          break;
        case 'Divorced':
          newFormData.maritalStatus = 'DIVORCED';
          break;
        default:
          break;
      }
    }

    if (newFormData.currentSpouseMaritalHistory) {
      switch (newFormData.currentSpouseMaritalHistory) {
        case 'Yes':
          newFormData.currentSpouseMaritalHistory = 'YES';
          break;
        case 'No':
          newFormData.currentSpouseMaritalHistory = 'NO';
          break;
        case "I'm not sure":
        case 'I’m not sure':
          newFormData.currentSpouseMaritalHistory = 'IDK';
          break;
        default:
          break;
      }
    }
    return { formData: newFormData, metadata };
  },
  // 5 > 6, remove nested jobs field (missed in migration 3 > 4)
  ({ formData, metadata }) => {
    const newFormData = { ...formData };
    const newMetadata = { ...metadata };
    if (formData['view:history']) {
      newMetadata.returnUrl = '/applicant/information';
      delete newFormData['view:history'];
    }
    return { formData: newFormData, metadata: newMetadata };
  },
  // 6 > 7, remove gender
  ({ formData, metadata }) => {
    const newFormData = { ...formData };
    if (formData.gender) {
      delete newFormData.gender;
    }
    return { formData: newFormData, metadata };
  },
  // 7 > 8, remove jobTitle and suffix
  ({ formData, metadata }) => {
    const newFormData = { ...formData };
    deleteArrayValue(newFormData.currentEmployers, ['jobTitle']);
    deleteArrayValue(newFormData.marriages, ['spouseFullName', 'suffix']);
    deleteArrayValue(newFormData.dependents, ['fullName', 'suffix']);
    return { formData: newFormData, metadata };
  },
  // 8 > 9, update state field
  ({ formData, metadata }) => {
    const newFormData = { ...formData };
    if (formData.veteranAddress) {
      newFormData.veteranAddress = updateCanadianAddress(
        formData.veteranAddress,
      );
    }
    if (formData.spouseAddress) {
      newFormData.spouseAddress = updateCanadianAddress(formData.spouseAddress);
    }
    if (formData.dependents) {
      newFormData.dependents = formData.dependents.map(d => {
        if (d.childAddress) {
          return { ...d, childAddress: updateCanadianAddress(d.childAddress) };
        }
        return d;
      });
    }
    return { formData: newFormData, metadata };
  },
  // 9 > 10, remove invalid service branches
  ({ formData, metadata }) => {
    const newFormData = { ...formData };
    if (formData.serviceBranch) {
      newFormData.serviceBranch = Object.keys(formData.serviceBranch).reduce(
        (branches, key) => {
          if (!key || !key.length) {
            return branches;
          }
          return {
            ...branches,
            [key]: formData.serviceBranch[key],
          };
        },
        {},
      );
    }
    return { formData: newFormData, metadata };
  },
  // 10 > 11. remove spouse entries that are outside of the marriages array
  // See https://dsva.slack.com/archives/C090CFCVATW/p1768162996687189
  ({ formData, metadata }) => {
    const newFormData = { ...formData };
    if (formData.spouseFullName) {
      delete newFormData.spouseFullName;
    }
    if (formData.reasonForSeparation) {
      delete newFormData.reasonForSeparation;
    }
    if (formData.dateOfMarriage) {
      delete newFormData.dateOfMarriage;
    }
    if (formData.dateOfSeparation) {
      delete newFormData.dateOfSeparation;
    }
    if (formData.locationOfMarriage) {
      delete newFormData.locationOfMarriage;
    }
    if (formData.locationOfSeparation) {
      delete newFormData.locationOfSeparation;
    }
    return { formData: newFormData, metadata };
  },
  // 11 > 12. remove additional spouse entries that are outside of the marriages
  // array; See https://dsva.slack.com/archives/C090CFCVATW/p1768162996687189
  ({ formData, metadata }) => {
    const newFormData = { ...formData };
    if (formData['view:pastMarriage']) {
      delete newFormData['view:pastMarriage'];
    }
    return { formData: newFormData, metadata };
  },
];
