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
