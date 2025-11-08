/**
 * @module pages/index
 * @description Barrel export file for VA Form 21P-530a pages
 * Pages are organized by chapter for better code organization and maintainability.
 */

// Chapter 1: Your organization's information
export {
  default as relationshipToVeteranPage,
} from './relationship-to-veteran';
export {
  default as organizationInformationPage,
} from './organization-information';
export {
  default as burialBenefitsRecipientPage,
} from './burial-benefits-recipient';
export {
  default as burialOrganizationMailingAddressPage,
} from './burial-organization-mailing-address';

// Chapter 2: Deceased Veteran information
export {
  default as veteranPersonalInformationPage,
} from './veteran-personal-information';
export { default as veteranIdentificationPage } from './veteran-identification';
export {
  default as veteranBirthInformationPage,
} from './veteran-birth-information';
export {
  default as veteranBurialInformationPage,
} from './veteran-burial-information';

// Chapter 3: Military history
export { servicePeriodsPages } from './service-period-pages';
export { previousNamePages } from './previous-name-pages';

// Chapter 4: Additional remarks
export { default as additionalRemarksPage } from './additional-remarks';
