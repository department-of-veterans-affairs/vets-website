/**
 * @module pages/index
 * @description Barrel export file for form pages
 * Exports all page components for easy importing
 */

// Original pages (to be removed after form config is updated)
export { VeteranIdentificationPage } from './veteran-identification';
export { ClaimantIdentificationPage } from './claimant-identification';

// New split pages
export { ClaimantQuestionPage } from './claimant-question';
export { ClaimantPersonalInfoPage } from './claimant-personal-info';
export { ClaimantIdentificationInfoPage } from './claimant-identification-info';
export { VeteranPersonalInfoPage } from './veteran-personal-info';
export { VeteranIdentificationInfoPage } from './veteran-identification-info';

// Other pages
export { NursingHomeDetailsPage } from './nursing-home-details';
export { MedicaidAndCostPage } from './medicaid-and-cost';
export { CertificationLevelOfCarePage } from './certification-level-of-care';
export { AdmissionDatePage } from './admission-date';
export { OfficialInfoAndSignaturePage } from './official-info-and-signature';
export { NursingOfficialInformationPage } from './nursing-official-information';
