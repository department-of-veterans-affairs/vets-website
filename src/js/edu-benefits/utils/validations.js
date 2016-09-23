import _ from 'lodash';
import { states } from './options-for-select';
import { dateToMoment, showRelinquishedEffectiveDate } from './helpers';

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

function validateIfDirtyDateObj(date, validator) {
  return validateIfDirtyDate(date.day, date.month, date.year, () => {
    return validator(date);
  });
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

function isValidYear(value) {
  return Number(value) >= 1900;
}

function isValidMonths(value) {
  return Number(value) >= 0;
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

function isValidName(value) {
  return /^[a-zA-Z][a-zA-Z '\-]*$/.test(value);
}

function isValidMonetaryValue(value) {
  if (value !== null) {
    return /^[$]{0,1}\d+\.?\d*$/.test(value);
  }
  return true;
}

// TODO: look into validation libraries (npm "validator")
function isValidPhone(value) {
  return /^\d{10}$/.test(value);
}

function isValidEmail(value) {
  // Comes from StackOverflow: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
}

// Pulled from https://en.wikipedia.org/wiki/Routing_transit_number#Check_digit
function isValidRoutingNumber(value) {
  if (/^\d{9}$/.test(value)) {
    const digits = value.split('').map(val => parseInt(val, 10));
    const weighted =
      3 * (digits[0] + digits[3] + digits[6]) +
      7 * (digits[1] + digits[4] + digits[7]) +
      (digits[2] + digits[5] + digits[8]);

    return (weighted % 10) === 0;
  }
  return false;
}

function isValidValue(validator, value) {
  return isBlank(value) || validator(value);
}

function isValidField(validator, field) {
  return isValidValue(validator, field.value);
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

function isValidFutureOrPastDateField(field) {
  if (!isBlankDateField(field)) {
    const momentDate = dateToMoment(field);
    return momentDate.isValid() && momentDate.year() > 1900;
  }

  return true;
}

function isValidDateRange(fromDate, toDate) {
  if (!isBlankDateField(fromDate) && !isBlankDateField(toDate)) {
    const momentStart = dateToMoment(fromDate);
    const momentEnd = dateToMoment(toDate);

    return momentStart.isBefore(momentEnd);
  }

  return true;
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

function isValidPersonalInfoPage(data) {
  return isValidFullNameField(data.veteranFullName) &&
      isValidRequiredField(isValidSSN, data.veteranSocialSecurityNumber) &&
      isValidDateField(data.veteranDateOfBirth);
}

function isValidBenefitsInformationPage(data) {
  return !data.chapter33 ||
    (isNotBlank(data.benefitsRelinquished.value) &&
      (!showRelinquishedEffectiveDate(data.benefitsRelinquished.value) ||
        (!isBlankDateField(data.benefitsRelinquishedDate) && isValidDateField(data.benefitsRelinquishedDate))));
}

function isValidTourOfDuty(tour) {
  return isNotBlank(tour.serviceBranch.value)
    && (!tour.doNotApplyPeriodToSelected || isNotBlank(tour.benefitsToApplyTo.value))
    && isValidDateField(tour.dateRange.from)
    && isValidDateField(tour.dateRange.to)
    && isValidDateRange(tour.dateRange.from, tour.dateRange.to);
}

function isValidMilitaryServicePage(data) {
  return (!data.chapter33 || isNotBlank(data.benefitsRelinquished.value))
    && data.toursOfDuty.length > 0
    && data.toursOfDuty.every(isValidTourOfDuty);
}

function isValidSchoolSelectionPage(data) {
  return isValidFutureOrPastDateField(data.educationStartDate);
}

function isValidEmploymentPeriod(data) {
  return isBlank(data.months.value) || isValidMonths(data.months.value);
}

function isValidEmploymentHistoryPage(data) {
  return (data.hasNonMilitaryJobs.value !== 'Y' || data.nonMilitaryJobs.every(isValidEmploymentPeriod));
}

function isValidEducationPeriod(data) {
  return isValidDateRange(data.dateRange.from, data.dateRange.to);
}

function isValidEducationHistoryPage(data) {
  return (isBlankDateField(data.highSchoolOrGedCompletionDate) || isValidDateField(data.highSchoolOrGedCompletionDate))
    && data.postHighSchoolTrainings.every(isValidEducationPeriod);
}

function isValidSecondaryContactPage(data) {
  return isValidField(isValidPhone, data.secondaryContact.phone);
}

function isValidContactInformationPage(data) {
  let emailConfirmationValid = true;

  if (isNotBlank(data.email.value) && isBlank(data.emailConfirmation.value)) {
    emailConfirmationValid = false;
  }

  if (data.email.value.toLowerCase() !== data.emailConfirmation.value.toLowerCase()) {
    emailConfirmationValid = false;
  }

  return isValidAddressField(data.veteranAddress) &&
      isValidField(isValidEmail, data.email) &&
      isValidField(isValidEmail, data.emailConfirmation) &&
      emailConfirmationValid &&
      isValidField(isValidPhone, data.homePhone) &&
      isValidField(isValidPhone, data.mobilePhone);
}

function isValidDirectDepositPage(data) {
  return isValidField(isValidRoutingNumber, data.bankAccount.routingNumber);
}

function isValidBenefitsHistoryPage(data) {
  return data.activeDutyRepaying.value !== 'Y' ||
    (!isBlankDateField(data.activeDutyRepayingPeriod.from)
    && !isBlankDateField(data.activeDutyRepayingPeriod.to)
    && isValidDateRange(data.activeDutyRepayingPeriod.from, data.activeDutyRepayingPeriod.to));
}

function isValidRotcScholarshipAmount(data) {
  return isValidField(isValidMonetaryValue, data.amount)
    && isValidField(isValidYear, data.year);
}

function isValidRotcHistoryPage(data) {
  return isNotBlank(data.seniorRotc.commissionYear.value)
    && data.seniorRotc.rotcScholarshipAmounts.every(isValidRotcScholarshipAmount);
}

function isValidPreviousClaimsPage() {
  return true;
}

function isValidForm(data) {
  return isValidBenefitsInformationPage(data)
    && isValidPersonalInfoPage(data)
    && isValidContactInformationPage(data)
    && isValidMilitaryServicePage(data)
    && isValidSchoolSelectionPage(data)
    && isValidEmploymentHistoryPage(data)
    && isValidEducationHistoryPage(data)
    && isValidSecondaryContactPage(data)
    && isValidDirectDepositPage(data)
    && isValidBenefitsHistoryPage(data)
    && isValidRotcHistoryPage(data)
    && isValidPreviousClaimsPage(data);
}

function isValidPage(completePath, pageData) {
  switch (completePath) {
    case '/veteran-information':
      return isValidPersonalInfoPage(pageData);
    case '/personal-information/contact-information':
      return isValidContactInformationPage(pageData);
    case '/benefits-eligibility/benefits-selection':
      return isValidBenefitsInformationPage(pageData);
    case '/military-history/military-service':
      return isValidMilitaryServicePage(pageData);
    case '/military-history/benefits-history':
      return isValidBenefitsHistoryPage(pageData);
    case '/school-selection/school-information':
      return isValidSchoolSelectionPage(pageData);
    case '/employment-history/employment-information':
      return isValidEmploymentHistoryPage(pageData);
    case '/education-history/education-information':
      return isValidEducationHistoryPage(pageData);
    case '/personal-information/secondary-contact':
      return isValidSecondaryContactPage(pageData);
    case '/personal-information/direct-deposit':
      return isValidDirectDepositPage(pageData);
    case '/military-history/rotc-history':
      return isValidRotcHistoryPage(pageData);
    case '/benefits-eligibility/previous-claims':
      return isValidPreviousClaimsPage(pageData);
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
  validateIfDirtyDateObj,
  validateIfDirtyProvider,
  initializeNullValues,
  isBlank,
  isNotBlank,
  isValidDate,
  isValidName,
  isValidSSN,
  isValidMonetaryValue,
  isValidPhone,
  isValidEmail,
  isValidYear,
  isValidMonths,
  isValidRoutingNumber,
  isValidField,
  isValidDateField,
  isValidFutureOrPastDateField,
  isValidDateRange,
  isValidForm,
  isValidPersonalInfoPage,
  isValidAddressField,
  isValidContactInformationPage,
  isValidMilitaryServicePage,
  isValidPage,
  isValidValue
};
