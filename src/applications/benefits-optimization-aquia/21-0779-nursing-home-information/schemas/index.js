import { z } from 'zod';
import { veteranIdentificationSchema } from './veteran-identification';
import { claimantIdentificationSchema } from './claimant-identification';
import { nursingHomeDetailsSchema } from './nursing-home';
import { medicaidAndCostSchema } from './medicaid-and-cost';
import { certificationLevelOfCareSchema } from './certification-level-of-care';
import { officialInfoAndSignatureSchema } from './official-info-and-signature';

/**
 * Main schema exports for 21-0779 Nursing Home Information form
 */

// Export veteran identification schemas
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

// Export claimant identification schema
export { claimantIdentificationSchema } from './claimant-identification';

// Export nursing home schemas
export {
  admissionDateSchema,
  nursingHomeAddressSchema,
  nursingHomeDetailsSchema,
} from './nursing-home';

// Export Medicaid and cost schemas
export {
  medicaidAndCostSchema,
  medicaidStartDateSchema,
  monthlyOutOfPocketSchema,
} from './medicaid-and-cost';

// Export certification level of care schema
export { certificationLevelOfCareSchema } from './certification-level-of-care';

// Export official info and signature schemas
export {
  officialInfoAndSignatureSchema,
  officialNameSchema,
  officialPhoneSchema,
  officialSignatureSchema,
  officialTitleSchema,
  signatureDateSchema,
} from './official-info-and-signature';

// Export legacy schemas for backward compatibility
export {
  contactInfoSchema,
  emailSchema,
  mailingAddressSchema,
  phoneSchema,
} from './contact-info';

export { personalInfoSchema } from './personal-info';

export {
  careTypeSchema,
  medicaidNumberSchema,
  nursingCareInfoSchema,
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

// Complete form schema
export const nursingHomeFormSchema = z.object({
  veteranIdentification: veteranIdentificationSchema,
  claimantIdentification: claimantIdentificationSchema,
  nursingHomeDetails: nursingHomeDetailsSchema,
  medicaidAndCost: medicaidAndCostSchema,
  certificationLevelOfCare: certificationLevelOfCareSchema,
  officialInfoAndSignature: officialInfoAndSignatureSchema,
});
