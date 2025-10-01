/**
 * @module schemas
 * @description Main schema exports for VA Form 21-0779 - Request for Nursing Home Information.
 * This module consolidates all validation schemas used throughout the form to ensure
 * data integrity and proper validation of user inputs for Aid & Attendance claims.
 */

import { z } from 'zod';
import { veteranIdentificationSchema } from './veteran-identification';
import { claimantIdentificationSchema } from './claimant-identification';
import { nursingHomeDetailsSchema } from './nursing-home';
import { medicaidAndCostSchema } from './medicaid-and-cost';
import { certificationLevelOfCareSchema } from './certification-level-of-care';
import { officialInfoAndSignatureSchema } from './official-info-and-signature';

/**
 * Veteran identification schemas
 * @description Exports schemas for validating veteran personal information including
 * name components, SSN, VA file number, and date of birth
 */
export {
  dateOfBirthSchema,
  firstNameSchema,
  fullNameSchema,
  lastNameSchema,
  middleNameSchema,
  ssnSchema,
  vaFileNumberSchema,
  veteranIdentificationSchema,
} from './veteran-identification';

/**
 * Claimant identification schema
 * @description Schema for validating claimant information when the claimant
 * is a spouse or dependent (not the veteran themselves)
 */
export { claimantIdentificationSchema } from './claimant-identification';

/**
 * Nursing home facility schemas
 * @description Schemas for validating nursing home facility information including
 * facility name, address, and admission date
 */
export {
  admissionDateSchema,
  nursingHomeAddressSchema,
  nursingHomeDetailsSchema,
} from './nursing-home';

/**
 * Medicaid and cost information schemas
 * @description Schemas for validating Medicaid coverage information and
 * monthly out-of-pocket nursing home costs
 */
export {
  medicaidAndCostSchema,
  medicaidStartDateSchema,
  monthlyOutOfPocketSchema,
} from './medicaid-and-cost';

/**
 * Certification level of care schema
 * @description Schema for validating the level of nursing care certification
 * (skilled vs intermediate care)
 */
export { certificationLevelOfCareSchema } from './certification-level-of-care';

/**
 * Official information and signature schemas
 * @description Schemas for validating nursing home official's information,
 * including name, title, phone, signature, and certification agreement
 */
export {
  officialInfoAndSignatureSchema,
  officialNameSchema,
  officialPhoneSchema,
  officialSignatureSchema,
  officialTitleSchema,
  signatureDateSchema,
} from './official-info-and-signature';

/**
 * Shared validation patterns and messages
 * @description Re-exported regex patterns and validation messages used across
 * the form for consistent validation of common data types like names, dates,
 * phone numbers, and postal codes
 */
export {
  CHAR_PATTERNS,
  CONTACT_PATTERNS,
  DATE_PATTERNS,
  ID_PATTERNS,
  MILITARY_POSTAL_PATTERNS,
  NAME_PATTERNS,
  POSTAL_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Complete form schema for VA Form 21-0779
 * @description Composite schema that validates the entire nursing home information form.
 * This schema combines all section schemas to ensure complete form validation
 * for Aid & Attendance claims processing.
 *
 * @type {import('zod').ZodSchema}
 * @property {Object} veteranIdentification - Veteran's personal identification information
 * @property {Object} claimantIdentification - Claimant's information if different from veteran
 * @property {Object} nursingHomeDetails - Nursing facility name, address, and admission date
 * @property {Object} medicaidAndCost - Medicaid coverage and monthly cost information
 * @property {Object} certificationLevelOfCare - Level of care certification (skilled/intermediate)
 * @property {Object} officialInfoAndSignature - Nursing home official's certification and signature
 */
export const nursingHomeFormSchema = z.object({
  veteranIdentification: veteranIdentificationSchema,
  claimantIdentification: claimantIdentificationSchema,
  nursingHomeDetails: nursingHomeDetailsSchema,
  medicaidAndCost: medicaidAndCostSchema,
  certificationLevelOfCare: certificationLevelOfCareSchema,
  officialInfoAndSignature: officialInfoAndSignatureSchema,
});
