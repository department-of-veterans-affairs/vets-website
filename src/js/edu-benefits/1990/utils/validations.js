import _ from 'lodash';
import moment from 'moment';
import { showSchoolAddress, showRelinquishedEffectiveDate } from '../../utils/helpers';
import { states } from '../../../common/utils/options-for-select';
import { dateToMoment } from '../../../common/utils/helpers';
import {
  isBlank,
  isBlankAddress,
  isBlankMonthYear,
  isNotBlank,
  isNotBlankDateField,
  isValidCurrentOrPastYear,
  isValidDateField,
  isValidDateOver17,
  isValidDateRange,
  isValidEmail,
  isValidField,
  isValidFullNameField,
  isValidMonths,
  isValidPartialDateField,
  isValidPartialMonthYearInPast,
  isValidPartialMonthYearRange,
  isValidPhone,
  isValidRequiredField,
  isValidSSN,
  isValidYear,
  isValidCanPostalCode,
  isValidUSZipCode,
  isValidRoutingNumber
} from '../../../common/utils/validations';

function isValidMonetaryValue(value) {
  if (value !== null) {
    return /^[$]{0,1}\d+\.?\d*$/.test(value);
  }
  return true;
}

function isValidFutureOrPastDateField(field) {
  if (isNotBlankDateField(field)) {
    const momentDate = dateToMoment(field);
    return momentDate.isValid() && momentDate.year() > 1900;
  }

  return true;
}

function isValidAddressField(field) {
  const initialOk = isNotBlank(field.street.value) &&
    isNotBlank(field.city.value) &&
    isNotBlank(field.country.value);

  let isValidPostalCode = true;

  if (field.country.value === 'USA') {
    isValidPostalCode = isValidPostalCode && isValidRequiredField(isValidUSZipCode, field.postalCode);
  }

  if (field.country.value === 'CAN') {
    isValidPostalCode = isValidPostalCode && isValidRequiredField(isValidCanPostalCode, field.postalCode);
  }

  // if we have a defined list of values, they will
  // be set as the state and zipcode keys
  if (_.hasIn(states, field.country.value)) {
    return initialOk &&
      isNotBlank(field.state.value) &&
      isValidPostalCode;
  }
  // if the entry was non-USA/CAN/MEX, only postal is
  // required, not provinceCode
  return initialOk && isNotBlank(field.postalCode.value);
}

function isValidPersonalInfoPage(data) {
  return isValidFullNameField(data.veteranFullName) &&
      isValidRequiredField(isValidSSN, data.veteranSocialSecurityNumber) &&
      isValidDateField(data.veteranDateOfBirth) &&
      isValidDateOver17(data.veteranDateOfBirth.day.value,
        data.veteranDateOfBirth.month.value,
        data.veteranDateOfBirth.year.value);
}

function isValidBenefitsInformationPage(data) {
  return data.chapter33 || data.chapter30 || data.chapter32 || data.chapter1606;
}

function isValidRelinquishedDate(field) {
  if (!isValidYear(field.year.value)) {
    return false;
  }
  // Allow dates up to two years ago
  const pastDate = moment().subtract(2, 'years');
  const date = dateToMoment(field);

  return isNotBlankDateField(field) && date.isValid() && date.isAfter(pastDate);
}

function isValidBenefitsRelinquishmentPage(data) {
  return !data.chapter33 ||
    (isNotBlank(data.benefitsRelinquished.value) &&
      (!showRelinquishedEffectiveDate(data.benefitsRelinquished.value) ||
        isValidRelinquishedDate(data.benefitsRelinquishedDate)));
}

function isValidTourOfDuty(tour) {
  return isNotBlank(tour.serviceBranch.value)
    && isValidDateField(tour.dateRange.from)
    && isValidPartialDateField(tour.dateRange.to)
    && isValidDateRange(tour.dateRange.from, tour.dateRange.to);
}

function isValidMilitaryServicePage(data) {
  return isBlank(data.serviceAcademyGraduationYear.value) || isValidCurrentOrPastYear(data.serviceAcademyGraduationYear.value);
}

function isValidServicePeriodsPage(data) {
  return data.toursOfDuty.length > 0
    && data.toursOfDuty.every(isValidTourOfDuty);
}

function isValidSchoolSelectionPage(data) {
  return isValidFutureOrPastDateField(data.educationStartDate)
    && (!showSchoolAddress(data.educationType.value) || isBlankAddress(data.school.address) || isValidAddressField(data.school.address));
}

function isValidEmploymentPeriod(data) {
  return isBlank(data.months.value) || isValidMonths(data.months.value);
}

function isValidEmploymentHistoryPage(data) {
  return (data.hasNonMilitaryJobs.value !== 'Y' || data.nonMilitaryJobs.every(isValidEmploymentPeriod));
}

function isValidEducationPeriod(data) {
  return isValidPartialMonthYearInPast(data.dateRange.from.month.value, data.dateRange.from.year.value)
    && isValidPartialMonthYearInPast(data.dateRange.to.month.value, data.dateRange.to.year.value)
    && isValidPartialMonthYearRange(data.dateRange.from, data.dateRange.to);
}

function isValidEducationHistoryPage(data) {
  return (isBlankMonthYear(data.highSchoolOrGedCompletionDate)
    || isValidPartialMonthYearInPast(data.highSchoolOrGedCompletionDate.month.value, data.highSchoolOrGedCompletionDate.year.value))
    && data.postHighSchoolTrainings.every(isValidEducationPeriod);
}

function isValidSecondaryContactPage(data) {
  return isValidField(isValidPhone, data.secondaryContact.phone)
    && (isBlankAddress(data.secondaryContact.address) || isValidAddressField(data.secondaryContact.address));
}

function isValidContactInformationPage(data) {
  let emailConfirmationValid = true;
  let isPhoneRequired = false;

  if (isNotBlank(data.email.value) && isBlank(data.emailConfirmation.value)) {
    emailConfirmationValid = false;
  }

  if (data.email.value.toLowerCase() !== data.emailConfirmation.value.toLowerCase()) {
    emailConfirmationValid = false;
  }

  if (data.preferredContactMethod.value === 'phone') {
    isPhoneRequired = true;
  }

  return isValidAddressField(data.veteranAddress) &&
      isValidRequiredField(isValidEmail, data.email) &&
      isValidRequiredField(isValidEmail, data.emailConfirmation) &&
      emailConfirmationValid &&
      (isPhoneRequired ? isValidRequiredField(isValidPhone, data.homePhone) : isValidField(isValidPhone, data.homePhone)) &&
      isValidField(isValidPhone, data.mobilePhone);
}

function isValidDirectDepositPage(data) {
  return isValidField(isValidRoutingNumber, data.bankAccount.routingNumber);
}

function isValidContributionsPage(data) {
  return !data.activeDutyRepaying ||
    (isNotBlankDateField(data.activeDutyRepayingPeriod.from)
    && isNotBlankDateField(data.activeDutyRepayingPeriod.to)
    && isValidDateRange(data.activeDutyRepayingPeriod.from, data.activeDutyRepayingPeriod.to));
}

function isValidRotcScholarshipAmount(data) {
  return (isBlank(data.amount.value) || isValidField(isValidMonetaryValue, data.amount))
    && (isBlank(data.year.value) || isValidField(isValidYear, data.year));
}

function isValidRotcHistoryPage(data) {
  return data.seniorRotcCommissioned.value !== 'Y' || data.seniorRotc.rotcScholarshipAmounts.every(isValidRotcScholarshipAmount);
}

function isValidForm(data) {
  return isValidBenefitsInformationPage(data)
    && isValidBenefitsRelinquishmentPage(data)
    && isValidPersonalInfoPage(data)
    && isValidContactInformationPage(data)
    && isValidMilitaryServicePage(data)
    && isValidServicePeriodsPage(data)
    && isValidSchoolSelectionPage(data)
    && isValidEmploymentHistoryPage(data)
    && isValidEducationHistoryPage(data)
    && isValidSecondaryContactPage(data)
    && isValidDirectDepositPage(data)
    && isValidContributionsPage(data)
    && isValidRotcHistoryPage(data)
    && data.privacyAgreementAccepted;
}

function isValidPage(path, pageData) {
  const completePath = path.replace('/1990', '');
  switch (completePath) {
    case '/veteran-information':
      return isValidPersonalInfoPage(pageData);
    case '/personal-information/contact-information':
      return isValidContactInformationPage(pageData);
    case '/benefits-eligibility/benefits-selection':
      return isValidBenefitsInformationPage(pageData);
    case '/benefits-eligibility/benefits-relinquishment':
      return isValidBenefitsRelinquishmentPage(pageData);
    case '/military-history/service-periods':
      return isValidServicePeriodsPage(pageData);
    case '/military-history/military-service':
      return isValidMilitaryServicePage(pageData);
    case '/military-history/contributions':
      return isValidContributionsPage(pageData);
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
    default:
      return true;
  }
}

export {
  isValidMonetaryValue,
  isValidRoutingNumber,
  isValidFutureOrPastDateField,
  isValidForm,
  isValidPersonalInfoPage,
  isValidAddressField,
  isValidContactInformationPage,
  isValidEducationHistoryPage,
  isValidMilitaryServicePage,
  isValidServicePeriodsPage,
  isValidSchoolSelectionPage,
  isValidPage,
  isValidRelinquishedDate,
  isValidTourOfDuty,
  isValidEmploymentPeriod,
  isValidRotcScholarshipAmount,
  isValidEducationPeriod
};
