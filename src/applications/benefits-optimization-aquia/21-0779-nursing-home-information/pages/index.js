/**
 * @module pages/index
 * @description Barrel export file for form pages and review components
 * Exports all page components and their corresponding review components
 */

// Page components and reviews
export {
  ClaimantQuestionPage,
  ClaimantQuestionReview,
} from './claimant-question';
export {
  ClaimantPersonalInfoPage,
  ClaimantPersonalInfoReview,
} from './claimant-personal-info';
export {
  ClaimantIdentificationInfoPage,
  ClaimantIdentificationInfoReview,
} from './claimant-identification-info';
export {
  VeteranPersonalInfoPage,
  VeteranPersonalInfoReview,
} from './veteran-personal-info';
export {
  VeteranIdentificationInfoPage,
  VeteranIdentificationInfoReview,
} from './veteran-identification-info';
export {
  NursingOfficialInformationPage,
  NursingOfficialInformationReview,
} from './nursing-official-information';
export {
  NursingHomeDetailsPage,
  NursingHomeDetailsReview,
} from './nursing-home-details';
export {
  CertificationLevelOfCarePage,
  CertificationLevelOfCareReview,
} from './certification-level-of-care';
export { AdmissionDatePage, AdmissionDateReview } from './admission-date';
export {
  MedicaidFacilityPage,
  MedicaidFacilityReview,
} from './medicaid-facility';
export {
  MedicaidApplicationPage,
  MedicaidApplicationReview,
} from './medicaid-application';
export { MedicaidStatusPage, MedicaidStatusReview } from './medicaid-status';
export {
  MedicaidStartDatePage,
  MedicaidStartDateReview,
} from './medicaid-start-date';
export { MonthlyCostsPage, MonthlyCostsReview } from './monthly-costs';

// Legacy page configuration objects (for backward compatibility)
export { identificationInformation } from './identification-information';
export { mailingAddress } from './mailing-address';
export { nameAndDateOfBirth } from './name-and-date-of-birth';
export { phoneAndEmailAddress } from './phone-and-email-address';
export { nursingCareInformation } from './nursing-care-information';
