import _ from 'lodash';

function isBlank(value) {
  if (value !== null) {
    return value === '';
  }
  return true;
}

function isNotBlank(value) {
  if (value !== null) {
    return value !== '';
  }
  return true;
}

// Conditions for valid SSN from the original 1010ez pdf form:
// '123456789' is not a valid SSN
// A value where the first 3 digits are 0 is not a valid SSN
// A value where the 4th and 5th digits are 0 is not a valid SSN
// A value where the last 4 digits are 0 is not a valid SSN
// A value with 3 digits, an optional -, 2 digits, an optional -, and 4 digits is a valid SSN
// 9 of the same digits (e.g., '111111111') is not a valid SSN
function isValidSSN(value) {
  if (value !== null) {
    if (value === '123456789' || value === '123-45-6789') {
      return false;
    } else if (/1{9}|2{9}|3{9}|4{9}|5{9}|6{9}|7{9}|8{9}|9{9}/.test(value)) {
      return false;
    } else if (/^0{3}-?\d{2}-?\d{4}$/.test(value)) {
      return false;
    } else if (/^\d{3}-?0{2}-?\d{4}$/.test(value)) {
      return false;
    } else if (/^\d{3}-?\d{2}-?0{4}$/.test(value)) {
      return false;
    }

    for (let i = 1; i < 10; i++) {
      const sameDigitRegex = new RegExp(`${i}{3}-?${i}{2}-?${i}{4}`);
      if (sameDigitRegex.test(value)) {
        return false;
      }
    }

    return /^\d{3}-?\d{2}-?\d{4}$/.test(value);
  }
  return true;
}

function isValidDate(day, month, year) {
  if (day !== null && month !== null && year !== null) {
    // Use the date class to see if the date parses back sanely as a
    // validation check. Not sure is a great idea...
    const adjustedMonth = Number(month) - 1;  // JS Date object 0-indexes months. WTF.
    const date = new Date(year, adjustedMonth, day);
    const today = new Date();

    if (today < date) {
      return false;
    }

    return date.getDate() === Number(day) &&
      date.getMonth() === adjustedMonth &&
      date.getFullYear() === Number(year);
  }
  return true;
}

function isValidName(value) {
  if (value !== null) {
    return /^[a-zA-Z '\-]+$/.test(value);
  }
  return true;
}

function isValidMonetaryValue(value) {
  if (value !== null) {
    return /^\d+\.?\d*$/.test(value);
  }
  return true;
}

// TODO: look into validation libraries (npm "validator")
function isValidPhone(value) {
  if (value !== null) {
    return /^\d{3}-\d{3}-\d{4}$/.test(value);
  }
  return true;
}

function isValidEmail(value) {
  if (value !== null) {
    // Comes from StackOverflow: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
  }
  return true;
}

// TODO:  1. what is a valid address?
//        2. 6 arguments to a function is ugly...
//        3. argument order is now based on form order... using
function isValidAddress(street, city, country, state, zipcode) {
  if (street !== null && city !== null && country !== null && state !== null && zipcode !== null) {
    return true;
  }
  // arbitraty use of field to keep linter happy until we answer #1
  return true;
}

function isValidInsurancePolicy(policyNumber, groupCode) {
  if (policyNumber !== null || groupCode !== null) {
    return isNotBlank(policyNumber) || isNotBlank(groupCode);
  }
  return true;
}

function isValidNameAndGeneralInformation(data) {
  return (isNotBlank(data.fullName.first) && isValidName(data.fullName.first)) &&
      (isBlank(data.fullName.middle) || isValidName(data.fullName.middle)) &&
      (isNotBlank(data.fullName.last) && isValidName(data.fullName.last)) &&
      isValidSSN(data.socialSecurityNumber) &&
      isNotBlank(data.gender) &&
      isNotBlank(data.maritalStatus) &&
      isValidDate(data.dateOfBirth.day, data.dateOfBirth.month, data.dateOfBirth.year);
}

function isValidVaInformation(data) {
  return isNotBlank(data.isVaServiceConnected);
}

function isValidAdditionalInformation(data) {
  return isNotBlank(data.facilityState) &&
    isNotBlank(data.vaMedicalFacility);
}

function isValidVeteranAddress(data) {
  return isValidAddress(data.address.street, data.address.city, data.address.country, data.address.state, data.address.zipcode) &&
      (isBlank(data.email) || isValidEmail(data.email)) &&
      (isBlank(data.emailConfirmation) || isValidEmail(data.emailConfirmation)) &&
      (isBlank(data.homePhone) || isValidPhone(data.homePhone)) &&
      (isBlank(data.mobilePhone) || isValidPhone(data.mobilePhone));
}

function isValidSpouseInformation(data) {
  return (isBlank(data.spouseFullName.first) || isValidName(data.spouseFullName.first)) &&
      (isBlank(data.spouseFullName.middle) || isValidName(data.spouseFullName.middle)) &&
      (isBlank(data.spouseFullName.last) || isValidName(data.spouseFullName.last)) &&
      (isBlank(data.spouseSocialSecurityNumber) || isValidSSN(data.spouseSocialSecurityNumber)) &&
      ((isBlank(data.spouseDateOfBirth.day) && isBlank(data.spouseDateOfBirth.month) && isBlank(data.spouseDateOfBirth.year)) ||
      isValidDate(data.spouseDateOfBirth.day, data.spouseDateOfBirth.month, data.spouseDateOfBirth.year)) &&
      ((isBlank(data.dateOfMarriage.day) && isBlank(data.dateOfMarriage.month) && isBlank(data.dateOfMarriage.year)) ||
      isValidDate(data.dateOfMarriage.day, data.dateOfMarriage.month, data.dateOfMarriage.year)) &&
      ((isBlank(data.spouseAddress.street) && isBlank(data.spouseAddress.city) && isBlank(data.spouseAddress.country) && isBlank(data.spouseAddress.state) && isBlank(data.spouseAddress.zipcode)) ||
      isValidAddress(data.spouseAddress.street, data.spouseAddress.city, data.spouseAddress.country, data.spouseAddress.state, data.spouseAddress.zipcode)) &&
      (isBlank(data.spousePhone) || isValidPhone(data.spousePhone));
}

function isValidChildInformation(child) {
  return (isValidName(child.childFullName.first) &&
      (isBlank(child.childFullName.middle) || isValidName(child.childFullName.middle)) &&
      isValidName(child.childFullName.last) &&
      isNotBlank(child.childRelation) &&
      isValidSSN(child.childSocialSecurityNumber) &&
      isValidDate(child.childBecameDependent.day, child.childBecameDependent.month, child.childBecameDependent.year) &&
      isValidDate(child.childDateOfBirth.day, child.childDateOfBirth.month, child.childDateOfBirth.year) &&
      (isBlank(child.childEducationExpenses) || isValidMonetaryValue(child.childEducationExpenses)));
}

function isValidChildren(data) {
  const children = data.children;
  if (!data.hasChildrenToReport) {
    return true;
  }
  for (let i = 0; i < children.length; i++) {
    if (!isValidChildInformation(children[i])) {
      return false;
    }
  }
  return true;
}

function isValidAnnualIncome(data) {
  return (isBlank(data.veteranGrossIncome) || isValidMonetaryValue(data.veteranGrossIncome)) &&
    (isBlank(data.veteranNetIncome) || isValidMonetaryValue(data.veteranNetIncome)) &&
    (isBlank(data.veteranOtherIncome) || isValidMonetaryValue(data.veteranOtherIncome)) &&
    (isBlank(data.spouseGrossIncome) || isValidMonetaryValue(data.spouseGrossIncome)) &&
    (isBlank(data.spouseNetIncome) || isValidMonetaryValue(data.spouseNetIncome)) &&
    (isBlank(data.spouseOtherIncome) || isValidMonetaryValue(data.spouseOtherIncome)) &&
    (isBlank(data.childrenGrossIncome) || isValidMonetaryValue(data.childrenGrossIncome)) &&
    (isBlank(data.childrenNetIncome) || isValidMonetaryValue(data.childrenNetIncome)) &&
    (isBlank(data.childrenOtherIncome) || isValidMonetaryValue(data.childrenOtherIncome));
}

function isValidDeductibleExpenses(data) {
  return (isBlank(data.deductibleMedicalExpenses) || isValidMonetaryValue(data.deductibleMedicalExpenses)) &&
      (isBlank(data.deductibleFuneralExpenses) || isValidMonetaryValue(data.deductibleFuneralExpenses)) &&
      (isBlank(data.deductibleEducationExpenses) || isValidMonetaryValue(data.deductibleEducationExpenses));
}

function isValidGeneralInsurance(data) {
  const providers = data.providers;
  if (!data.isCoveredByHealthInsurance) {
    return true;
  }
  for (let i = 0; i < providers.length; i++) {
    if (!(isNotBlank(providers[i].insuranceName) &&
        isNotBlank(providers[i].insurancePolicyHolderName) &&
        isValidInsurancePolicy(providers[i].insurancePolicyNumber, providers[i].insuranceGroupCode))
    ) {
      return false;
    }
  }
  return true;
}

function isValidMedicareMedicaid(data) {
  return (isBlank(data.medicarePartAEffectiveDate.day) && isBlank(data.medicarePartAEffectiveDate.month) && isBlank(data.medicarePartAEffectiveDate.year)) ||
    isValidDate(data.medicarePartAEffectiveDate.day, data.medicarePartAEffectiveDate.month, data.medicarePartAEffectiveDate.year);
}

function isValidServiceInformation(data) {
  return ((isBlank(data.lastEntryDate.day) && isBlank(data.lastEntryDate.month) && isBlank(data.lastEntryDate.year)) ||
      isValidDate(data.lastEntryDate.day, data.lastEntryDate.month, data.lastEntryDate.year)) &&
      ((isBlank(data.lastDischargeDate.day) && isBlank(data.lastDischargeDate.month) && isBlank(data.lastDischargeDate.year)) ||
      isValidDate(data.lastDischargeDate.day, data.lastDischargeDate.month, data.lastDischargeDate.year));
}

function isValidSection(completePath, sectionData) {
  switch (completePath) {
    case '/personal-information/name-and-general-information':
      return isValidNameAndGeneralInformation(sectionData);
    case '/personal-information/va-information':
      return isValidVaInformation(sectionData);
    case '/personal-information/additional-information':
      return isValidAdditionalInformation(sectionData);
    case '/personal-information/veteran-address':
      return isValidVeteranAddress(sectionData);
    case '/financial-assessment/spouse-information':
      return isValidSpouseInformation(sectionData);
    case '/financial-assessment/child-information':
      return isValidChildren(sectionData);
    case '/financial-assessment/annual-income':
      return isValidAnnualIncome(sectionData);
    case '/financial-assessment/deductible-expenses':
      return isValidDeductibleExpenses(sectionData);
    case '/insurance-information/general':
      return isValidGeneralInsurance(sectionData);
    case '/insurance-information/medicare-medicaid':
      return isValidMedicareMedicaid(sectionData);
    case '/military-service/service-information':
      return isValidServiceInformation(sectionData);
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
  initializeNullValues,
  isBlank,
  isNotBlank,
  isValidDate,
  isValidName,
  isValidSSN,
  isValidMonetaryValue,
  isValidPhone,
  isValidEmail,
  isValidAddress,
  isValidInsurancePolicy,
  isValidNameAndGeneralInformation,
  isValidVaInformation,
  isValidAdditionalInformation,
  isValidVeteranAddress,
  isValidSpouseInformation,
  isValidChildInformation,
  isValidChildren,
  isValidAnnualIncome,
  isValidDeductibleExpenses,
  isValidGeneralInsurance,
  isValidMedicareMedicaid,
  isValidServiceInformation,
  isValidSection
};
