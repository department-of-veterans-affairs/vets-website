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

function isValidSSN(value) {
  if (value !== null) {
    return /^\d{3}-\d{2}-\d{4}$/.test(value);
  }
  return true;
}

function isValidDate(day, month, year) {
  if (day !== null && month !== null && year !== null) {
    // Use the date class to see if the date parses back sanely as a
    // validation check. Not sure this is a great idea...
    const adjustedMonth = Number(month) - 1;  // JS Date object 0-indexes months. WTF.
    const date = new Date(year, adjustedMonth, day);
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
    let n = 0;
    if (street === '') n++;
    if (city === '') n++;
    if (country === '') n++;
    if (state === '') n++;
    if (zipcode === '') n++;
    return true; 
  }
  // arbitraty use of field to keep linter happy until we answer #1
  return true;
}

function isValidNameAndGeneralInformation(data) {
  return this.isNotBlank(data.fullName.first) &&
      this.isValidName(data.fullName.first) &&
      (isBlank(data.fullName.middle) || isValidName(data.fullName.middle)) &&
      this.isNotBlank(data.fullName.last) &&
      this.isValidName(data.fullName.last) &&
      this.isValidSSN(data.socialSecurityNumber) &&
      this.isValidDate(data.dateOfBirth.day, data.dateOfBirth.month, data.dateOfBirth.year);
}

function isValidVeteranAddress(data) {
  return this.isValidAddress(data.address.street, data.address.city, data.address.country, data.address.state, data.address.zipcode) &&
      (this.isBlank(data.email) || this.isValidEmail(data.email)) &&
      (this.isBlank(data.emailConfirmation) || this.isValidEmail(data.emailConfirmation)) &&
      (this.isBlank(data.homePhone) || this.isValidPhone(data.homePhone)) &&
      (this.isBlank(data.mobilePhone) || this.isValidPhone(data.mobilePhone));
}

function isValidSpouseInformation(data) {
  return this.isValidSSN(data.spouseSocialSecurityNumber) &&
      this.isValidDate(data.spouseDateOfBirth.day, data.spouseDateOfBirth.month, data.spouseDateOfBirth.year) &&
      this.isValidDate(data.dateOfMarriage.day, data.dateOfMarriage.month, data.dateOfMarriage.year) &&
      this.isValidAddress(data.spouseAddress.street, data.spouseAddress.city, data.spouseAddress.country, data.spouseAddress.state, data.spouseAddress.zipcode) &&
      this.isValidPhone(data.spousePhone);
}

function isValidChildInformation(data) {
  const children = data.children;
  for (let i = 0; i < children.length; i++) {
    if (!(this.isValidName(children[i].childFullName.first) &&
        (this.isBlank(children[i].childFullName.middle) || this.isValidName(children[i].childFullName.middle)) &&
        this.isValidName(children[i].childFullName.last) &&
        this.isValidSSN(children[i].childSocialSecurityNumber) &&
        this.isValidDate(children[i].childBecameDependent.day, children[i].childBecameDependent.month, children[i].childBecameDependent.year) &&
        this.isValidDate(children[i].childDateOfBirth.day, children[i].childDateOfBirth.month, children[i].childDateOfBirth.year) &&
        (this.isBlank(children[i].childEducationExpenses) || this.isValidMonetaryValue(children[i].childEducationExpenses)))
    ) {
      return false;
    }
  }
  return true;
}

function isValidAnnualIncome(data) {
  return this.isValidMonetaryValue(data.veteranGrossIncome) &&
    this.isValidMonetaryValue(data.veteranNetIncome) &&
    this.isValidMonetaryValue(data.veteranOtherIncome) &&
    this.isValidMonetaryValue(data.spouseGrossIncome) &&
    this.isValidMonetaryValue(data.spouseNetIncome) &&
    this.isValidMonetaryValue(data.spouseOtherIncome) &&
    this.isValidMonetaryValue(data.childrenGrossIncome) &&
    this.isValidMonetaryValue(data.childrenNetIncome) &&
    this.isValidMonetaryValue(data.childrenOtherIncome);
}

function isValidDeductibleExpenses(data) {
  return this.isValidMonetaryValue(data.deductibleMedicalExpenses) &&
      this.isValidMonetaryValue(data.deductibleFuneralExpenses) &&
      this.isValidMonetaryValue(data.deductibleEducationExpenses);
}

function isValidGeneralInsurance(data) {
  const providers = data.providers;
  for (let i = 0; i < providers.length; i++) {
    if (!this.isValidPhone(providers[i].insurancePhone)) {
      return false;
    }
  }
  return true;
}

function isValidMedicareMedicaid(data) {
  return this.isValidDate(data.medicarePartAEffectiveDate.day, data.medicarePartAEffectiveDate.month, data.medicarePartAEffectiveDate.year);
}

function isValidServiceInformation(data) {
  return this.isValidDate(data.lastEntryDate.day, data.lastEntryDate.month, data.lastEntryDate.year) &&
      this.isValidDate(data.lastDischargeDate.day, data.lastDischargeDate.month, data.lastDischargeDate.year);
}

function isValidSection(completePath, sectionData) {
  switch (completePath) {
    case '/personal-information/name-and-general-information':
      return this.isValidNameAndGeneralInformation(sectionData);
    case '/personal-information/veteran-address':
      return this.isValidVeteranAddress(sectionData);
    case '/financial-assessment/spouse-information':
      return this.isValidSpouseInformation(sectionData);
    case '/financial-assessment/child-information':
      return this.isValidChildInformation(sectionData);
    case '/financial-assessment/annual-income':
      return this.isValidAnnualIncome(sectionData);
    case '/financial-assessment/deductible-expenses':
      return this.isValidDeductibleExpenses(sectionData);
    case '/insurance-information/general-insurance':
      return this.isValidGeneralInsurance(sectionData);
    case '/insurance-information/medicare-medicaid':
      return this.isValidMedicareMedicaid(sectionData);
    case '/military-service/service-information':
      return this.isValidServiceInformation(sectionData);
    default:
      return true;
  }
}

export {
  isBlank,
  isNotBlank,
  isValidDate,
  isValidName,
  isValidSSN,
  isValidMonetaryValue,
  isValidPhone,
  isValidEmail,
  isValidAddress,
  isValidNameAndGeneralInformation,
  isValidVeteranAddress,
  isValidSpouseInformation,
  isValidChildInformation,
  isValidAnnualIncome,
  isValidDeductibleExpenses,
  isValidGeneralInsurance,
  isValidMedicareMedicaid,
  isValidServiceInformation,
  isValidSection
};
