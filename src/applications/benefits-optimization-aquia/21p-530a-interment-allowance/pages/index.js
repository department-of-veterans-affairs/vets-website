/**
 * @module pages/index
 * @description Barrel export file for VA Form 21P-530a pages
 * Pages are organized by chapter for better code organization and maintainability.
 */

// Chapter 1: Your organization's information
export { OrganizationInformationPage } from './organization-information';
export { BurialBenefitsRecipientPage } from './burial-benefits-recipient';
export { MailingAddressPage } from './mailing-address';

// Chapter 2: Deceased Veteran information
export { VeteranIdentificationPage } from './veteran-identification';
export { VeteranBirthInformationPage } from './veteran-birth-information';
export { VeteranBurialInformationPage } from './veteran-burial-information';

// Chapter 3: Military history
export { ServicePeriodsPage } from './service-periods';
export {
  VeteranServedUnderDifferentNamePage,
} from './veteran-served-under-different-name';
export { VeteranPreviousNamesPage } from './veteran-previous-names';

// Chapter 4: Additional remarks
export { AdditionalRemarksPage } from './additional-remarks';
