/**
 * @module schemas
 * @description Main schema exports for VA Form 21P-530a - State or Tribal Organization Application
 * for Interment Allowance. This module consolidates all validation schemas used throughout the form
 * to ensure data integrity and proper validation of organization and veteran information.
 */

<<<<<<< HEAD
=======
import { z } from 'zod';
import { veteranIdentificationSchema } from './veteran-identification';
import { veteranServiceSchema } from './veteran-service';
import { cemeteryInformationSchema } from './cemetery-information';
import { officialSignatureSchema } from './official-signature';

>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
/**
 * Veteran identification schemas
 * @description Exports schemas for validating veteran personal information including
 * name components, SSN, service number, VA file number, dates, and place of birth
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
<<<<<<< HEAD
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
  servicePeriodItemSchema,
  servicePeriodsSchema,
=======
  placeEnteredServiceSchema,
  placeSeparatedSchema,
  rankSchema,
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
  veteranServiceSchema,
} from './veteran-service';

/**
<<<<<<< HEAD
 * Organization information schemas
 * @description Schemas for validating organization name, recipient name, phone, and address
 */
export {
=======
 * Cemetery and organization schemas
 * @description Schemas for validating cemetery location, organization details,
 * burial date, and recipient payment information
 */
export {
  cemeteryInformationSchema,
  cemeteryLocationSchema,
  cemeteryNameSchema,
  dateOfBurialSchema,
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
  organizationNameSchema,
  recipientAddressSchema,
  recipientNameSchema,
  recipientPhoneSchema,
<<<<<<< HEAD
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
=======
} from './cemetery-information';

/**
 * Official signature and certification schemas
 * @description Schemas for validating state or tribal official's signature,
 * title, date, and optional remarks
 */
export {
  officialSignatureSchema,
  officialTitleSchema,
  remarksSchema,
  signatureDateSchema,
  signatureSchema,
} from './official-signature';
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

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
<<<<<<< HEAD
=======

/**
 * Complete form schema for VA Form 21P-530a
 * @description Composite schema that validates the entire interment allowance application.
 * This schema combines all section schemas to ensure complete form validation
 * for state and tribal organization claims processing.
 *
 * @type {import('zod').ZodSchema}
 * @property {Object} veteranIdentification - Deceased veteran's personal identification information
 * @property {Object} veteranService - Veteran's military service history
 * @property {Object} cemeteryInformation - Cemetery location and organization payment details
 * @property {Object} officialSignature - State or tribal official's certification and signature
 */
export const intermentAllowanceFormSchema = z.object({
  veteranIdentification: veteranIdentificationSchema,
  veteranService: veteranServiceSchema,
  cemeteryInformation: cemeteryInformationSchema,
  officialSignature: officialSignatureSchema,
});
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
