/**
 * @module schemas
 * @description Main schema exports for VA Form 21-0779 - Request for Nursing Home Information.
 * This module consolidates all validation schemas used throughout the form to ensure
 * data integrity and proper validation of user inputs for Aid & Attendance claims.
 */

import { z } from 'zod';
import { nursingHomeDetailsSchema } from './nursing-home';
import { certificationLevelOfCareSchema } from './certification-level-of-care';
import { nursingOfficialInformationSchema } from './nursing-official-information';
import { claimantQuestionSchema } from './claimant-question';
import {
  claimantPersonalInfoSchema,
  claimantIdentificationInfoSchema,
} from './claimant-identification';

import {
  veteranPersonalInfoSchema,
  veteranIdentificationInfoSchema,
} from './veteran-identification';

import { admissionDateInfoSchema } from './admission-date';

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
  veteranPersonalInfoSchema,
  veteranIdentificationInfoSchema,
} from './veteran-identification';

import { medicaidFacilitySchema } from './medicaid-facility';
import { medicaidApplicationSchema } from './medicaid-application';
import { currentMedicaidStatusSchema } from './medicaid-status';
import { medicaidStartDateInfoSchema } from './medicaid-start-date';
import { monthlyCostsSchema } from './monthly-costs';

/**
 * Claimant question schema
 * @description Schema for validating who is the patient in the nursing home facility
 */
export { claimantQuestionSchema, patientTypeSchema } from './claimant-question';

/**
 * Claimant identification schemas
 * @description Schema for validating claimant information when the claimant
 * is a spouse or dependent (not the veteran themselves)
 */
export {
  claimantPersonalInfoSchema,
  claimantIdentificationInfoSchema,
} from './claimant-identification';

/**
 * Nursing home facility schemas
 * @description Schemas for validating nursing home facility information including
 * facility name and address
 */
export {
  nursingHomeAddressSchema,
  nursingHomeDetailsSchema,
} from './nursing-home';

/**
 * Admission date schemas
 * @description Schemas for validating nursing home admission date
 */
export { admissionDateSchema, admissionDateInfoSchema } from './admission-date';

/**
 * Medicaid facility schemas
 * @description Schemas for validating Medicaid facility approval status
 */
export {
  medicaidFacilitySchema,
  medicaidFacilityStatusSchema,
} from './medicaid-facility';

/**
 * Medicaid application schemas
 * @description Schemas for validating Medicaid application status
 */
export {
  medicaidApplicationSchema,
  medicaidApplicationStatusSchema,
} from './medicaid-application';

/**
 * Medicaid status schemas
 * @description Schemas for validating Medicaid status
 */
export {
  medicaidStatusSchema,
  currentMedicaidStatusSchema,
} from './medicaid-status';

/**
 * Medicaid start date schemas
 * @description Schemas for validating Medicaid coverage start date
 */
export {
  medicaidStartDateSchema,
  medicaidStartDateInfoSchema,
} from './medicaid-start-date';

/**
 * Monthly costs schemas
 * @description Schemas for validating monthly out-of-pocket nursing home costs
 */
export { monthlyOutOfPocketSchema, monthlyCostsSchema } from './monthly-costs';

/**
 * Certification level of care schema
 * @description Schema for validating the level of nursing care certification
 * (skilled vs intermediate care)
 */
export { certificationLevelOfCareSchema } from './certification-level-of-care';

/**
 * Nursing official information schemas
 * @description Schemas for validating nursing home official's personal information
 * for form completion authorization
 */
export {
  nursingOfficialInformationSchema,
  nursingOfficialFirstNameSchema,
  nursingOfficialLastNameSchema,
  nursingOfficialJobTitleSchema,
  nursingOfficialPhoneNumberSchema,
} from './nursing-official-information';

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
 * @property {Object} claimantQuestion - Patient type selection (veteran or spouse/parent)
 * @property {Object} claimantPersonalInfo - Claimant's personal information if not veteran
 * @property {Object} claimantIdentificationInfo - Claimant's identification if not veteran
 * @property {Object} veteranPersonalInfo - Veteran's personal information
 * @property {Object} veteranIdentificationInfo - Veteran's identification information
 * @property {Object} nursingHomeDetails - Nursing facility name and address
 * @property {Object} admissionDateInfo - Date of admission to nursing home
 * @property {Object} certificationLevelOfCare - Level of care certification (skilled/intermediate)
 * @property {Object} medicaidFacility - Medicaid facility approval status
 * @property {Object} medicaidApplication - Patient's Medicaid application status
 * @property {Object} medicaidStatus - Patient's Medicaid status
 * @property {Object} medicaidStartDateInfo - Medicaid coverage start date
 * @property {Object} monthlyCosts - Monthly out-of-pocket costs
 * @property {Object} nursingOfficialInformation - Nursing home official's information
 */
export const nursingHomeFormSchema = z.object({
  // Patient and claimant information
  claimantQuestion: claimantQuestionSchema,
  claimantPersonalInfo: claimantPersonalInfoSchema.optional(),
  claimantIdentificationInfo: claimantIdentificationInfoSchema.optional(),

  // Veteran information
  veteranPersonalInfo: veteranPersonalInfoSchema,
  veteranIdentificationInfo: veteranIdentificationInfoSchema,

  // Nursing home information
  nursingHomeDetails: nursingHomeDetailsSchema,

  // Certification and official information
  certificationLevelOfCare: certificationLevelOfCareSchema,
  admissionDateInfo: admissionDateInfoSchema,

  // Medicaid information
  medicaidFacility: medicaidFacilitySchema,
  medicaidApplication: medicaidApplicationSchema,
  medicaidStatus: currentMedicaidStatusSchema,
  medicaidStartDateInfo: medicaidStartDateInfoSchema.optional(),

  // Cost information
  monthlyCosts: monthlyCostsSchema,

  // Official information
  nursingOfficialInformation: nursingOfficialInformationSchema,
});
