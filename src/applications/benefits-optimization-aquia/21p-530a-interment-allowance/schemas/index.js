/**
 * @module schemas
 * @description Main schema exports for VA Form 21P-530a - State or Tribal Organization Application
 * for Interment Allowance. This module consolidates all validation schemas used throughout the form
 * to ensure data integrity and proper validation of organization and veteran information.
 */

/**
 * Relationship to veteran schemas
 * @description Schema for validating the applicant's relationship to the veteran
 * (state cemetery or tribal organization)
 */
export { relationshipToVeteranSchema } from './relationship-to-veteran';

/**
 * Veteran identification schemas
 * @description Exports schemas for validating veteran personal information including
 * name components, SSN, VA file number, dates, and place of birth
 */
export {
  dateOfBirthSchema,
  dateOfDeathSchema,
  firstNameSchema,
  fullNameSchema,
  lastNameSchema,
  middleNameSchema,
  placeOfBirthSchema,
  serviceNumberSchema,
  ssnSchema,
  vaFileNumberSchema,
  veteranIdentificationSchema,
} from './veteran-identification';

/**
 * Veteran service schemas
 * @description Schemas for validating veteran military service information including
 * branch, service dates, locations, rank, and alternate service names
 */
export {
  alternateNameSchema,
  branchOfServiceSchema,
  dateEnteredServiceSchema,
  dateSeparatedSchema,
  formatPreviousNameSummary,
  formatServicePeriodSummary,
  hasAlternateNamesSchema,
  isPreviousNameEmpty,
  isServicePeriodEmpty,
  placeEnteredServiceSchema,
  placeSeparatedSchema,
  previousNameItemSchema,
  previousNamesSchema,
  rankSchema,
  servicePeriodBase,
  servicePeriodItemSchema,
  servicePeriodsSchema,
  veteranServiceSchema,
} from './veteran-service';

/**
 * Organization information schemas
 * @description Schemas for validating organization name, recipient name, phone, and address
 */
export {
  organizationNameSchema,
  recipientAddressSchema,
  recipientNameSchema,
  recipientPhoneSchema,
} from './organization-information';

/**
 * Burial information schemas
 * @description Schemas for validating burial date and cemetery information
 */
export {
  cemeteryLocationSchema,
  cemeteryNameSchema,
  dateOfBurialSchema,
} from './burial-information';

/**
 * Remarks schemas
 * @description Schemas for validating additional remarks text
 */
export { remarksSchema } from './remarks';

/**
 * Shared validation patterns and messages
 * @description Re-exported regex patterns and validation messages used across
 * the form for consistent validation of common data types
 */
export {
  CHAR_PATTERNS,
  CONTACT_PATTERNS,
  DATE_PATTERNS,
  MILITARY_POSTAL_PATTERNS,
  NAME_PATTERNS,
  POSTAL_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';
