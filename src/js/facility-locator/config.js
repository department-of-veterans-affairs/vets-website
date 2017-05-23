import environment from '../common/helpers/environment';

// Base URL to be used in API requests.
export const api = {
  url: `${environment.API_URL}/v0/facilities/va`,
  settings: {
    headers: {
      'Content-Type': 'application/json',
    }
  }
};

export const benefitsServices = {
  All: 'All',
  ApplyingForBenefits: 'Applying for benefits',
  BurialClaimAssistance: 'Burial claim help',
  DisabilityClaimAssistance: 'Disability claim help',
  eBenefitsRegistrationAssistance: 'eBenefits registration help',
  EducationAndCareerCounseling: 'Education and career counseling',
  EducationClaimAssistance: 'Education claim help',
  FamilyMemberClaimAssistance: 'Family member claim help',
  HomelessAssistance: 'Help for homeless Veterans',
  VAHomeLoanAssistance: 'VA Home Loan help',
  InsuranceClaimAssistanceAndFinancialCounseling: 'Insurance claim help and financial counseling',
  IntegratedDisabilityEvaluationSystemAssistance: 'Integrated Disability Evaluation System Assistance (IDES)',
  PreDischargeClaimAssistance: 'Predischarge claim help',
  TransitionAssistance: 'Transition help',
  UpdatingDirectDepositInformation: 'Updating direct deposit information',
  VocationalRehabilitationAndEmploymentAssistance: 'Vocational Rehabilitation and Employment (VR&E) help',
};
