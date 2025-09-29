import { z } from 'zod';
import { contactInfoSchema } from './contact-info';
import {
  nursingCareInfoSchema,
  nursingHomeDetailsSchema,
} from './nursing-home';
import { personalInfoSchema } from './personal-info';

/**
 * Main schema exports for 21-0779 Nursing Home Information form
 */

// Complete form schema
export const nursingHomeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
  nursingHomeDetails: nursingHomeDetailsSchema,
  nursingCareInfo: nursingCareInfoSchema,
});

// Re-export individual schemas
export {
  dateOfBirthSchema,
  firstNameSchema,
  fullNameSchema,
  lastNameSchema,
  middleNameSchema,
  // Personal info
  personalInfoSchema,
  ssnSchema,
  suffixSchema,
  vaFileNumberSchema,
} from './personal-info';

export {
  addressSchema,
  // Contact info
  contactInfoSchema,
  emailSchema,
  mailingAddressSchema,
  phoneSchema,
  zipCodeSchema,
} from './contact-info';

export {
  admissionDateSchema,
  careTypeSchema,
  medicaidNumberSchema,
  nursingCareInfoSchema,
  nursingHomeAddressSchema,
  // Nursing home
  nursingHomeDetailsSchema,
  paymentInfoSchema,
} from './nursing-home';

// Export constants specific to 21-0779
export { MEDICAID_PATTERNS, MEDICAID_MESSAGES } from './constants';

// Export shared patterns for convenience
export {
  CHAR_PATTERNS,
  CONTACT_PATTERNS,
  DATE_PATTERNS,
  ID_PATTERNS,
  MILITARY_POSTAL_PATTERNS,
  NAME_PATTERNS,
  POSTAL_PATTERNS,
  VALIDATION_MESSAGES,
  VALIDATION_MESSAGES as PATTERN_MESSAGES, // Alias for backward compatibility
} from '@bio-aquia/shared/schemas/regex-patterns';
