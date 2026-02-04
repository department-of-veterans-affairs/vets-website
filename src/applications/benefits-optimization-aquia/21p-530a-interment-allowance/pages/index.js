/**
 * @module pages/index
 * @description Barrel export file for VA Form 21P-530a pages
 * Pages are organized by chapter for better code organization and maintainability.
 */

// Chapter 1: Your organization's information
export { organizationNamePage } from './organization-information';
export { burialBenefitsRecipientPage } from './burial-benefits-recipient';
export {
  burialOrganizationMailingAddressPage,
} from './burial-organization-mailing-address';

// Chapter 2: Deceased Veteran information
export { veteranPersonalInformationPage } from './veteran-personal-information';
export { veteranIdentificationPage } from './veteran-identification';
export { veteranBirthInformationPage } from './veteran-birth-information';
export { veteranBurialInformationPage } from './veteran-burial-information';

// Chapter 3: Military history
export { servicePeriodsPages } from './service-period-pages';
export { previousNamePages } from './previous-name-pages';

// Chapter 4: Additional remarks
export { additionalRemarksPage } from './additional-remarks';
