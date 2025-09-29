/**
 * @module pages/index
 * @description Barrel export file for all form page components
 */

// Section I - Identification
export { default as EmployerInformationPage } from './employer-information';
export { default as VeteranInformationPage } from './veteran-information';

// Section II - Employment Information
export { default as EmploymentDetailsPage } from './employment-details';
export {
  default as TerminationInformationPage,
} from './termination-information';

// Section III - Reserve or National Guard
export { default as ReserveGuardQuestionPage } from './reserve-guard-question';
export { default as ReserveGuardStatusPage } from './reserve-guard-status';

// Section IV - Benefits Information
export { default as BenefitsInformationPage } from './benefits-information';

// Certification
export { default as CertificationPage } from './certification';
