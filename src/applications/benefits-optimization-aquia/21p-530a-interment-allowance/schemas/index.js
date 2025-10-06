/**
 * @module schemas
 * @description Main schema exports for VA Form 21P-530a - State or Tribal Organization Application
 * for Interment Allowance. This module consolidates all validation schemas used throughout the form
 * to ensure data integrity and proper validation of organization and veteran information.
 */

import { z } from 'zod';
import { veteranIdentificationSchema } from './veteran-identification';
import { veteranServiceSchema } from './veteran-service';
import { cemeteryInformationSchema } from './cemetery-information';
import { officialSignatureSchema } from './official-signature';

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
  formatServicePeriodSummary,
  isServicePeriodEmpty,
  placeEnteredServiceSchema,
  placeSeparatedSchema,
  rankSchema,
  servicePeriodItemSchema,
  servicePeriodsSchema,
  veteranServiceSchema,
} from './veteran-service';

/**
 * Cemetery and organization schemas
 * @description Schemas for validating cemetery location, organization details,
 * burial date, and recipient payment information
 */
export {
  cemeteryInformationSchema,
  cemeteryLocationSchema,
  cemeteryNameSchema,
  dateOfBurialSchema,
  organizationNameSchema,
  recipientAddressSchema,
  recipientNameSchema,
  recipientPhoneSchema,
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
