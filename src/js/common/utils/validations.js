import _ from 'lodash';
import moment from 'moment';
import { states } from './options-for-select';

function validateIfDirty(field, validator) {
  if (field.dirty) {
    return validator(field.value);
  }

  return true;
}

function validateIfDirtyDate(dayField, monthField, yearField, validator) {
  if (dayField.dirty && monthField.dirty && yearField.dirty) {
    return validator(dayField.value, monthField.value, yearField.value);
  }

  return true;
}

function validateIfDirtyProvider(field1, field2, validator) {
  if (field1.dirty || field2.dirty) {
    return validator(field1.value, field2.value);
  }

  return true;
}

function isBlank(value) {
  return value === '';
}

function isNotBlank(value) {
  return value !== '';
}

// Conditions for valid SSN from the original 1010ez pdf form:
// '123456789' is not a valid SSN
// A value where the first 3 digits are 0 is not a valid SSN
// A value where the 4th and 5th digits are 0 is not a valid SSN
// A value where the last 4 digits are 0 is not a valid SSN
// A value with 3 digits, an optional -, 2 digits, an optional -, and 4 digits is a valid SSN
// 9 of the same digits (e.g., '111111111') is not a valid SSN
function isValidSSN(value) {
  if (value === '123456789' || value === '123-45-6789') {
    return false;
  } else if (/^0{3}-?\d{2}-?\d{4}$/.test(value)) {
    return false;
  } else if (/^\d{3}-?0{2}-?\d{4}$/.test(value)) {
    return false;
  } else if (/^\d{3}-?\d{2}-?0{4}$/.test(value)) {
    return false;
  }

  const noBadSameDigitNumber = _.without(_.range(0, 10), 2, 4, 5)
    .every(i => {
      const sameDigitRegex = new RegExp(`${i}{3}-?${i}{2}-?${i}{4}`);
      return !sameDigitRegex.test(value);
    });

  if (!noBadSameDigitNumber) {
    return false;
  }

  return /^\d{3}-?\d{2}-?\d{4}$/.test(value);
}

function isValidDate(day, month, year) {
  // Use the date class to see if the date parses back sanely as a
  // validation check. Not sure is a great idea...
  const adjustedMonth = Number(month) - 1;  // JS Date object 0-indexes months. WTF.
  const date = new Date(year, adjustedMonth, day);
  const today = new Date();

  if (today < date) {
    return false;
  }

  if (Number(year) < 1900) {
    return false;
  }

  return date.getDate() === Number(day) &&
    date.getMonth() === adjustedMonth &&
    date.getFullYear() === Number(year);
}

function isValidAnyDate(day, month, year) {
  return moment({
    day,
    month: parseInt(month, 10) - 1,
    year
  }).isValid();
}

function isValidDateOver17(day, month, year) {
  const momentDate = moment({
    day,
    month: parseInt(month, 10) - 1,
    year
  });
  return momentDate.isBefore(moment().endOf('day').subtract(17, 'years'));
}

function isValidName(value) {
  return /^[a-zA-Z][a-zA-Z '\-]*$/.test(value);
}

function isValidMonetaryValue(value) {
  if (value !== null) {
    return /^\d+\.?\d*$/.test(value);
  }
  return true;
}

function isValidUSZipCode(value) {
  return /(^\d{5}$)|(^\d{5}[ -]{0,1}\d{4}$)/.test(value);
}

function isValidCanPostalCode(value) {
  return /^[a-zA-Z]\d[a-zA-Z][ -]{0,1}\d[a-zA-Z]\d$/.test(value);
}

// TODO: look into validation libraries (npm "validator")
function isValidPhone(value) {
  // Strip spaces, dashes, and parens
  const stripped = value.replace(/[- )(]/g, '');
  // Count number of digits
  return /^\d{10}$/.test(stripped);
}

function isValidEmail(value) {
  // Comes from StackOverflow: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
}

function isValidField(validator, field) {
  return isBlank(field.value) || validator(field.value);
}

function isValidRequiredField(validator, field) {
  return isNotBlank(field.value) && validator(field.value);
}

function isBlankDateField(field) {
  return isBlank(field.day.value) && isBlank(field.month.value) && isBlank(field.year.value);
}

function isValidDateField(field) {
  return isValidDate(field.day.value, field.month.value, field.year.value);
}

function isValidFullNameField(field) {
  return isValidName(field.first.value) &&
    (isBlank(field.middle.value) || isValidName(field.middle.value)) &&
    isValidName(field.last.value);
}

function isValidAddressField(field) {
  const initialOk = isNotBlank(field.street.value) &&
    isNotBlank(field.city.value) &&
    isNotBlank(field.country.value);

  // if we have a defined list of values, they will
  // be set as the state and zipcode keys
  if (_.hasIn(states, field.country.value)) {
    return initialOk &&
      isNotBlank(field.state.value) &&
      isNotBlank(field.zipcode.value);
  }
  // if the entry was non-USA/CAN/MEX, only postal is
  // required, not provinceCode
  return initialOk && isNotBlank(field.postalCode.value);
}

function isValidInsurancePolicy(policyNumber, groupCode) {
  if (policyNumber !== null || groupCode !== null) {
    return isNotBlank(policyNumber) || isNotBlank(groupCode);
  }
  return true;
}

function isValidEntryDateField(date, dateOfBirth) {
  let adjustedDate;
  let adjustedDateOfBirth;

  if (!isBlankDateField(date) && !isBlankDateField(dateOfBirth)) {
    const adjustedBirthYear = Number(dateOfBirth.year.value) + 15;
    adjustedDate = new Date(`${date.month.value}/${date.day.value}/${date.year.value}`);
    adjustedDateOfBirth = new Date(`${dateOfBirth.month.value}/${dateOfBirth.day.value}/${adjustedBirthYear}`);

    if (adjustedDate < adjustedDateOfBirth) {
      return false;
    }
  }

  return true;
}

function isValidDischargeDateField(date, entryDate) {
  let adjustedDate;
  let adjustedEntryDate;
  const d = new Date();
  const today = new Date(d.setHours(0, 0, 0, 0));

  if (!isBlankDateField(date) && !isBlankDateField(entryDate)) {
    adjustedDate = new Date(`${date.month.value}/${date.day.value}/${date.year.value}`);
    adjustedEntryDate = new Date(`${entryDate.month.value}/${entryDate.day.value}/${entryDate.year.value}`);

    // Validation Rule: Discharge date must be after entry date and before today
    if (adjustedDate < adjustedEntryDate || adjustedDate >= today) {
      return false;
    }
  }

  return true;
}

function isValidDependentDateField(date, dateOfBirth) {
  let adjustedDate;
  let adjustedDateOfBirth;

  if (!isBlankDateField(date) && !isBlankDateField(dateOfBirth)) {
    adjustedDate = new Date(date.year.value, date.month.value, date.day.value);
    adjustedDateOfBirth = new Date(dateOfBirth.year.value, dateOfBirth.month.value, dateOfBirth.day.value);

    if (adjustedDate < adjustedDateOfBirth) {
      return false;
    }
  }

  return true;
}

function isValidMarriageDate(date, dateOfBirth, spouseDateOfBirth) {
  let adjustedDate;
  let adjustedDateOfBirth;
  let adjustedSpouseDateOfBirth;

  if (!isBlankDateField(date) && !isBlankDateField(dateOfBirth) && !isBlankDateField(spouseDateOfBirth)) {
    adjustedDate = new Date(date.year.value, date.month.value, date.day.value);
    adjustedDateOfBirth = new Date(dateOfBirth.year.value, dateOfBirth.month.value, dateOfBirth.day.value);
    adjustedSpouseDateOfBirth = new Date(spouseDateOfBirth.year.value, spouseDateOfBirth.month.value, spouseDateOfBirth.day.value);

    if (adjustedDate < adjustedDateOfBirth) {
      return false;
    } else if (adjustedDate < adjustedSpouseDateOfBirth) {
      return false;
    }
  }

  return true;
}

function isValidPersonalInfoSection(data) {
  return isValidFullNameField(data.veteranFullName);
}

function isValidBirthInformationSection(data) {
  return isValidRequiredField(isValidSSN, data.veteranSocialSecurityNumber) &&
      isValidDateField(data.veteranDateOfBirth);
}

function isValidDemographicInformation(data) {
  return isNotBlank(data.gender.value);
}

function isValidVaInformation(data) {
  return validateIfDirty(data.isVaServiceConnected, isNotBlank) &&
      validateIfDirty(data.compensableVaServiceConnected, isNotBlank) &&
      validateIfDirty(data.receivesVaPension, isNotBlank);
}

function isValidVeteranAddress(data) {
  return isValidAddressField(data.veteranAddress);
}

function isValidContactInformationSection(data) {
  let emailConfirmationValid = true;

  if (isNotBlank(data.email.value) && isBlank(data.emailConfirmation.value)) {
    emailConfirmationValid = false;
  }

  if (data.email.value.toLowerCase() !== data.emailConfirmation.value.toLowerCase()) {
    emailConfirmationValid = false;
  }

  return isValidField(isValidEmail, data.email) &&
      isValidField(isValidEmail, data.emailConfirmation) &&
      emailConfirmationValid &&
      isValidField(isValidPhone, data.homePhone) &&
      isValidField(isValidPhone, data.mobilePhone);
}

function isValidFinancialDisclosure(data) {
  return validateIfDirty(data.understandsFinancialDisclosure, _.identity);
}

function isValidIncome(income) {
  return isValidField(isValidMonetaryValue, income.grossIncome) &&
      isValidField(isValidMonetaryValue, income.netIncome) &&
      isValidField(isValidMonetaryValue, income.otherIncome);
}

function isValidSpouseInformation(data) {
  let isValidSpouse = true;
  let isValidSpouseAddress = true;

  if (data.maritalStatus.value === 'Married' || data.maritalStatus.value === 'Separated') {
    isValidSpouse = isValidFullNameField(data.spouseFullName) &&
      isValidSSN(data.spouseSocialSecurityNumber.value) &&
      isValidDateField(data.spouseDateOfBirth) &&
      isValidDateField(data.dateOfMarriage) &&
      isNotBlank(data.sameAddress.value);
  }

  if (data.sameAddress === 'N') {
    isValidSpouseAddress = isValidAddressField(data.spouseAddress) &&
        isValidField(isValidPhone, data.spousePhone);
  }

  return isNotBlank(data.maritalStatus.value) &&
      isValidSpouse &&
      isValidSpouseAddress;
}

function isValidChildInformationField(child) {
  // TODO: add validation to check if DOB is before date of dependence
  // TODO: should this check income? I don't think so because otherwise it blocks movement from the
  // main ChildInformation component if there is a mistake from another component.
  return isValidFullNameField(child.childFullName) &&
    isNotBlank(child.childRelation.value) &&
    isValidRequiredField(isValidSSN, child.childSocialSecurityNumber) &&
    isValidDateField(child.childDateOfBirth) &&
    isValidDateField(child.childBecameDependent) &&
    isValidDependentDateField(child.childBecameDependent, child.childDateOfBirth) &&
    isValidField(isValidMonetaryValue, child.childEducationExpenses);
}

function isValidChildren(data) {
  let allChildrenValid = true;
  const children = data.children;

  for (let i = 0; i < children.length; i++) {
    if (!isValidChildInformationField(children[i])) {
      allChildrenValid = false;
    }
  }

  return isNotBlank(data.hasChildrenToReport.value) &&
      allChildrenValid;
}

function isValidChildrenIncome(children) {
  for (let i = 0; i < children.length; i++) {
    if (!isValidIncome(children[i])) {
      return false;
    }
  }
  return true;
}

function isValidAnnualIncome(data) {
  let isValidSpouseIncomeFields = true;

  if (data.spouseGrossIncome && data.spouseNetIncome && data.spouseOtherIncome) {
    isValidSpouseIncomeFields =
      isValidField(isValidMonetaryValue, data.spouseGrossIncome) &&
      isValidField(isValidMonetaryValue, data.spouseNetIncome) &&
      isValidField(isValidMonetaryValue, data.spouseOtherIncome);
  }

  return isValidField(isValidMonetaryValue, data.veteranGrossIncome) &&
    isValidField(isValidMonetaryValue, data.veteranNetIncome) &&
    isValidField(isValidMonetaryValue, data.veteranOtherIncome) &&
    isValidSpouseIncomeFields &&
    isValidChildrenIncome(data.children);
}

function isValidDeductibleExpenses(data) {
  return isValidField(isValidMonetaryValue, data.deductibleMedicalExpenses) &&
    isValidField(isValidMonetaryValue, data.deductibleFuneralExpenses) &&
    isValidField(isValidMonetaryValue, data.deductibleEducationExpenses);
}

function isValidVAFacility(data) {
  return validateIfDirty(data.facilityState, isNotBlank) &&
    validateIfDirty(data.vaMedicalFacility, isNotBlank);
}

function isValidMedicareMedicaid(data) {
  let isValidEffectiveDate = true;

  if (data.isEnrolledMedicarePartA.value === 'Y') {
    isValidEffectiveDate = isValidDateField(data.medicarePartAEffectiveDate);
  }

  return validateIfDirty(data.isMedicaidEligible, isNotBlank) &&
    validateIfDirty(data.isEnrolledMedicarePartA, isNotBlank) &&
    isValidEffectiveDate;
}

function isValidGeneralInsurance(data) {
  let allProvidersValid = true;
  const providers = data.providers;

  for (let i = 0; i < providers.length; i++) {
    if (!(isNotBlank(providers[i].insuranceName.value) &&
        isNotBlank(providers[i].insurancePolicyHolderName.value) &&
        isValidInsurancePolicy(providers[i].insurancePolicyNumber.value, providers[i].insuranceGroupCode.value))
    ) {
      allProvidersValid = false;
    }
  }

  return isNotBlank(data.isCoveredByHealthInsurance.value) &&
      allProvidersValid;
}

function isValidServiceInformation(data) {
  return isNotBlank(data.lastServiceBranch.value) &&
      (isValidDateField(data.lastEntryDate) && isValidEntryDateField(data.lastEntryDate, data.veteranDateOfBirth)) &&
      (isValidDateField(data.lastDischargeDate) && isValidDischargeDateField(data.lastDischargeDate, data.lastEntryDate)) &&
      isNotBlank(data.dischargeType.value);
}

function isValidForm(data) {
  return isValidPersonalInfoSection(data) &&
  isValidBirthInformationSection(data) &&
  isValidDemographicInformation(data) &&
  isValidVeteranAddress(data) &&
  isValidContactInformationSection(data) &&
  isValidServiceInformation(data) &&
  isValidVaInformation(data) &&
  isValidFinancialDisclosure(data) &&
  isValidSpouseInformation(data) &&
  isValidChildren(data) &&
  isValidAnnualIncome(data) &&
  isValidDeductibleExpenses(data) &&
  isValidVAFacility(data) &&
  isValidGeneralInsurance(data) &&
  isValidMedicareMedicaid(data);
}

function isValidSection(completePath, sectionData) {
  switch (completePath) {
    case '/veteran-information/personal-information':
      return isValidPersonalInfoSection(sectionData);
    case '/veteran-information/birth-information':
      return isValidBirthInformationSection(sectionData);
    case '/veteran-information/demographic-information':
      return isValidDemographicInformation(sectionData);
    case '/veteran-information/veteran-address':
      return isValidVeteranAddress(sectionData);
    case '/veteran-information/contact-information':
      return isValidContactInformationSection(sectionData);
    case '/military-service/service-information':
      return isValidServiceInformation(sectionData);
    case '/va-benefits/basic-information':
      return isValidVaInformation(sectionData);
    case '/household-information/financial-disclosure':
      return isValidFinancialDisclosure(sectionData);
    case '/household-information/spouse-information':
      return isValidSpouseInformation(sectionData);
    case '/household-information/child-information':
      return isValidChildren(sectionData);
    case '/household-information/annual-income':
      return isValidAnnualIncome(sectionData);
    case '/household-information/deductible-expenses':
      return isValidDeductibleExpenses(sectionData);
    case '/insurance-information/va-facility':
      return isValidVAFacility(sectionData);
    case '/insurance-information/general':
      return isValidGeneralInsurance(sectionData);
    case '/insurance-information/medicare':
      return isValidMedicareMedicaid(sectionData);
    default:
      return true;
  }
}

function initializeNullValues(value) {
  if (value === null) {
    return '';
  } else if (_.isPlainObject(value)) {
    return _.mapValues(value, (v, _k) => { return initializeNullValues(v); });
  } else if (_.isArray(value)) {
    return value.map(initializeNullValues);
  }

  return value;
}

export {
  validateIfDirty,
  validateIfDirtyDate,
  validateIfDirtyProvider,
  initializeNullValues,
  isBlank,
  isNotBlank,
  isValidDate,
  isValidName,
  isValidSSN,
  isValidMonetaryValue,
  isValidUSZipCode,
  isValidCanPostalCode,
  isValidPhone,
  isValidEmail,
  isValidInsurancePolicy,
  isValidEntryDateField,
  isValidDischargeDateField,
  isValidDependentDateField,
  isValidMarriageDate,
  isValidField,
  isValidFinancialDisclosure,
  isValidForm,
  isValidPersonalInfoSection,
  isValidBirthInformationSection,
  isValidVaInformation,
  isValidVAFacility,
  isValidVeteranAddress,
  isValidContactInformationSection,
  isValidSpouseInformation,
  isValidChildren,
  isValidAnnualIncome,
  isValidDeductibleExpenses,
  isValidGeneralInsurance,
  isValidMedicareMedicaid,
  isValidServiceInformation,
  isValidSection,
  isValidAnyDate,
  isValidDateOver17
};
