/**
 * @module pages/index
 * @description Barrel export file for form page configurations
 */

/** @exports {PageSchema} identificationInformation - SSN/VA file number page */
export {
  default as identificationInformation,
} from './identification-information';

/** @exports {PageSchema} mailingAddress - Mailing address page */
export { default as mailingAddress } from './mailing-address';

/** @exports {PageSchema} nameAndDateOfBirth - Name and DOB page */
export { default as nameAndDateOfBirth } from './name-and-date-of-birth';

/** @exports {PageSchema} phoneAndEmailAddress - Contact information page */
export { default as phoneAndEmailAddress } from './phone-and-email-address';
