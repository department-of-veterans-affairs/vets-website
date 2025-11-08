/**
 * @module pages/index
 * @description Barrel export file for VA Form 21P-530a pages
 * Pages are organized by chapter for better code organization and maintainability.
 */

// Relationship to the Veteran
export { RelationshipToVeteranPage } from './relationship-to-veteran';

// Chapter 1: Your organization's information
export { OrganizationInformationPage } from './organization-information';
export { BurialBenefitsRecipientPage } from './burial-benefits-recipient';
export { MailingAddressPage } from './mailing-address';

// Chapter 2: Deceased Veteran information
export { VeteranIdentificationPage } from './veteran-identification';
export { VeteranSsnFileNumberPage } from './veteran-ssn-file-number';
export { VeteranBirthInformationPage } from './veteran-birth-information';
export { VeteranBurialInformationPage } from './veteran-burial-information';

// Chapter 3: Military history
export { ServiceBranchPage } from './service-branch';
export { ServiceDatesPage } from './service-dates';
export { LocationsAndRankPage } from './locations-and-rank';
export { ServicePeriodsPage } from './service-periods';
export {
  VeteranServedUnderDifferentNamePage,
} from './veteran-served-under-different-name';
export { PreviousNameEntryPage } from './previous-name-entry';
export { VeteranPreviousNamesPage } from './veteran-previous-names';

// Chapter 4: Additional remarks
export { AdditionalRemarksPage } from './additional-remarks';
