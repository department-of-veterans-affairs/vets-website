import formConfig from '../../config/form';

const formChapters = formConfig.chapters;
export default {
  applicantInformation:
    formChapters.applicantInformation.pages.applicantInformation.path,
  mailingAddress: formChapters.applicantInformation.pages.mailingAddress.path,
  contactInformation:
    formChapters.applicantInformation.pages.contactInformation.path,

  servicePeriod: formChapters.militaryHistory.pages.servicePeriod.path,
  generalHistory: formChapters.militaryHistory.pages.hasOtherNames.path,
  previousNames: formChapters.militaryHistory.pages.otherNames.path,
  pow: formChapters.militaryHistory.pages.pow.path,

  age: formChapters.healthAndEmploymentInformation.pages.age.path,
  socialSecurityDisability:
    formChapters.healthAndEmploymentInformation.pages.socialSecurityDisability
      .path,
  medicalCondition:
    formChapters.healthAndEmploymentInformation.pages.medicalCondition.path,
  nursingHome:
    formChapters.healthAndEmploymentInformation.pages.nursingHome.path,
  medicaidCoverage:
    formChapters.healthAndEmploymentInformation.pages.medicaidCoverage.path,
  medicaidStatus:
    formChapters.healthAndEmploymentInformation.pages.medicaidStatus.path,
  specialMonthlyPension:
    formChapters.healthAndEmploymentInformation.pages.specialMonthlyPension
      .path,
  vaTreatmentHistory:
    formChapters.healthAndEmploymentInformation.pages.vaTreatmentHistory.path,
  vaMedicalCenters:
    formChapters.healthAndEmploymentInformation.pages.vaMedicalCenters.path,
  federalTreatmentHistory:
    formChapters.healthAndEmploymentInformation.pages.federalTreatmentHistory
      .path,
  federalMedicalCenters:
    formChapters.healthAndEmploymentInformation.pages.federalMedicalCenters
      .path,
  currentEmployment:
    formChapters.healthAndEmploymentInformation.pages.currentEmployment.path,
  currentEmploymentHistory:
    formChapters.healthAndEmploymentInformation.pages.currentEmploymentHistory
      .path,
  previousEmploymentHistory:
    formChapters.healthAndEmploymentInformation.pages.previousEmploymentHistory
      .path,

  maritalStatus: formChapters.householdInformation.pages.maritalStatus.path,
  marriageInfo: formChapters.householdInformation.pages.marriageInfo.path,
  marriageHistory: formChapters.householdInformation.pages.marriageHistory.path,
  spouseInfo: formChapters.householdInformation.pages.spouseInfo.path,
  reasonForCurrentSeparation:
    formChapters.householdInformation.pages.reasonForCurrentSeparation.path,
  currentSpouseAddress:
    formChapters.householdInformation.pages.currentSpouseAddress.path,
  currentSpouseMonthlySupport:
    formChapters.householdInformation.pages.currentSpouseMonthlySupport.path,
  currentSpouseMaritalHistory:
    formChapters.householdInformation.pages.currentSpouseMaritalHistory.path,
  currentSpouseFormerMarriages:
    formChapters.householdInformation.pages.currentSpouseFormerMarriages.path,
  hasDependents: formChapters.householdInformation.pages.hasDependents.path,
  dependentChildren:
    formChapters.householdInformation.pages.dependentChildren.path,
  dependentChildInformation:
    formChapters.householdInformation.pages.dependentChildInformation.path,
  dependentChildAddress:
    formChapters.householdInformation.pages.dependentChildAddress.path,

  totalNetWorth: formChapters.financialInformation.pages.totalNetWorth.path,
  netWorthEstimation:
    formChapters.financialInformation.pages.netWorthEstimation.path,
  transferredAssets:
    formChapters.financialInformation.pages.transferredAssets.path,
  homeOwnership: formChapters.financialInformation.pages.homeOwnership.path,
  homeAcreageMoreThanTwo:
    formChapters.financialInformation.pages.homeAcreageMoreThanTwo.path,
  homeAcreageValue:
    formChapters.financialInformation.pages.homeAcreageValue.path,
  landMarketable: formChapters.financialInformation.pages.landMarketable.path,
  receivesIncome: formChapters.financialInformation.pages.receivesIncome.path,
  incomeSources: formChapters.financialInformation.pages.incomeSources.path,
  hasCareExpenses: formChapters.financialInformation.pages.hasCareExpenses.path,
  careExpenses: formChapters.financialInformation.pages.careExpenses.path,
  hasMedicalExpenses:
    formChapters.financialInformation.pages.hasMedicalExpenses.path,
  medicalExpenses: formChapters.financialInformation.pages.medicalExpenses.path,
  directDeposit: formChapters.additionalInformation.pages.directDeposit.path,
  documentUpload: formChapters.additionalInformation.pages.documentUpload.path,
};
