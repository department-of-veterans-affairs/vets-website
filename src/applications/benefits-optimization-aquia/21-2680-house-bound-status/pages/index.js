/**
 * @module pages
 * @description Barrel file for all form page configurations
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

// Veteran Information Chapter
export {
  veteranInformationUiSchema,
  veteranInformationSchema,
} from './veteran-information';

export { veteranSsnUiSchema, veteranSsnSchema } from './veteran-ssn';

export {
  veteranAddressUiSchema,
  veteranAddressSchema,
} from './veteran-address';

// Claimant Information Chapter
export {
  claimantRelationshipUiSchema,
  claimantRelationshipSchema,
} from './claimant-relationship';

export {
  claimantInformationUiSchema,
  claimantInformationSchema,
} from './claimant-information';

export { claimantSsnUiSchema, claimantSsnSchema } from './claimant-ssn';

export {
  claimantAddressUiSchema,
  claimantAddressSchema,
} from './claimant-address';

export {
  claimantContactUiSchema,
  claimantContactSchema,
} from './claimant-contact';

// Claim Information Chapter
export { benefitTypeUiSchema, benefitTypeSchema } from './benefit-type';

// Hospitalization Chapter
export {
  hospitalizationStatusUiSchema,
  hospitalizationStatusSchema,
} from './hospitalization-status';

export {
  hospitalizationDateUiSchema,
  hospitalizationDateSchema,
} from './hospitalization-date';

export {
  hospitalizationFacilityUiSchema,
  hospitalizationFacilitySchema,
} from './hospitalization-facility';

// Examiner Notification Chapter
export { examinerEmailUiSchema, examinerEmailSchema } from './examiner-email';
