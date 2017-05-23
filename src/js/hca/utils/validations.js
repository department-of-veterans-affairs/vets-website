import _ from 'lodash';
import { states } from '../../common/utils/options-for-select';
import {
  isBlank,
  isBlankDateField,
  isNotBlank,
  isValidCanPostalCode,
  isValidDateField,
  isValidEmail,
  isValidField,
  isValidFullNameField,
  isValidMonetaryValue,
  isValidPhone,
  isValidRequiredField,
  isValidSSN,
  isValidUSZipCode,
  validateIfDirty
} from '../../common/utils/validations';

function validateIfDirtyProvider(field1, field2, validator) {
  if (field1.dirty || field2.dirty) {
    return validator(field1.value, field2.value);
  }

  return true;
}

function isValidLastName(value) {
  return /^[a-zA-Z '\-]{2,}$/.test(value);
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

function isValidAddressField(field) {
  const initialOk = isNotBlank(field.street.value) &&
    isNotBlank(field.city.value) &&
    isNotBlank(field.country.value);

  let isValidPostalCode = true;

  if (field.country.value === 'USA') {
    isValidPostalCode = isValidPostalCode && isValidRequiredField(isValidUSZipCode, field.zipcode);
  }

  if (field.country.value === 'CAN') {
    isValidPostalCode = isValidPostalCode && isValidRequiredField(isValidCanPostalCode, field.zipcode);
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

function isValidInsurancePolicy(policyNumber, groupCode) {
  if (policyNumber !== null || groupCode !== null) {
    return isNotBlank(policyNumber) || isNotBlank(groupCode);
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
  return isNotBlank(data.gender.value) &&
      isNotBlank(data.maritalStatus.value);
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
  return validateIfDirty(data.discloseFinancialInformation, isNotBlank);
}

function isValidRequiredIncome(income) {
  return isValidRequiredField(isValidMonetaryValue, income.grossIncome) &&
      isValidRequiredField(isValidMonetaryValue, income.netIncome) &&
      isValidRequiredField(isValidMonetaryValue, income.otherIncome);
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

  if (data.sameAddress.value === 'N') {
    isValidSpouseAddress = isValidAddressField(data.spouseAddress) &&
        isValidField(isValidPhone, data.spousePhone);
  }

  return data.discloseFinancialInformation.value === 'N' || (
      isNotBlank(data.maritalStatus.value) &&
      isValidSpouse &&
      isValidSpouseAddress
    );
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
    isValidRequiredField(isValidMonetaryValue, child.childEducationExpenses);
}

function isValidChildren(data) {
  let allChildrenValid = true;
  const children = data.children;

  for (let i = 0; i < children.length; i++) {
    if (!isValidChildInformationField(children[i])) {
      allChildrenValid = false;
    }
  }

  return data.discloseFinancialInformation.value === 'N' || (
    isNotBlank(data.hasChildrenToReport.value)
    && allChildrenValid
  );
}

function isValidChildrenIncome(children) {
  for (let i = 0; i < children.length; i++) {
    if (!isValidRequiredIncome(children[i])) {
      return false;
    }
  }
  return true;
}

function isValidAnnualIncome(data) {
  let isValidSpouseIncomeFields = true;
  if (data.maritalStatus.value === 'Married' || data.maritalStatus.value === 'Separated') {
    isValidSpouseIncomeFields =
      isValidRequiredField(isValidMonetaryValue, data.spouseGrossIncome) &&
      isValidRequiredField(isValidMonetaryValue, data.spouseNetIncome) &&
      isValidRequiredField(isValidMonetaryValue, data.spouseOtherIncome);
  }

  return data.discloseFinancialInformation.value === 'N' || (
      isValidRequiredField(isValidMonetaryValue, data.veteranGrossIncome) &&
      isValidRequiredField(isValidMonetaryValue, data.veteranNetIncome) &&
      isValidRequiredField(isValidMonetaryValue, data.veteranOtherIncome) &&
      isValidSpouseIncomeFields &&
      isValidChildrenIncome(data.children)
    );
}

function isValidDeductibleExpenses(data) {
  return data.discloseFinancialInformation.value === 'N' || (
      isValidRequiredField(isValidMonetaryValue, data.deductibleMedicalExpenses) &&
      isValidRequiredField(isValidMonetaryValue, data.deductibleFuneralExpenses) &&
      isValidRequiredField(isValidMonetaryValue, data.deductibleEducationExpenses)
    );
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
  let isValidFinancialDisclosureSections = true;

  if (data.discloseFinancialInformation.value === 'Y') {
    isValidFinancialDisclosureSections = isValidSpouseInformation(data) &&
        isValidChildren(data) &&
        isValidAnnualIncome(data) &&
        isValidDeductibleExpenses(data);
  }

  return isValidPersonalInfoSection(data) &&
  isValidBirthInformationSection(data) &&
  isValidDemographicInformation(data) &&
  isValidVeteranAddress(data) &&
  isValidContactInformationSection(data) &&
  isValidServiceInformation(data) &&
  isValidVaInformation(data) &&
  isValidFinancialDisclosure(data) &&
  isValidFinancialDisclosureSections &&
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

export {
  validateIfDirtyProvider,
  isValidLastName,
  isValidEntryDateField,
  isValidDischargeDateField,
  isValidInsurancePolicy,
  isValidDependentDateField,
  isValidMarriageDate,
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
  isValidSection
};
