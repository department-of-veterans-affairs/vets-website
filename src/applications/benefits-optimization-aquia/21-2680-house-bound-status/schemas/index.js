/**
 * @module schemas
 * @description Validation schemas for VA Form 21-2680
 * Examination for Housebound Status or Permanent Need for Regular Aid & Attendance
 */

// Benefit type schemas
export {
  benefitTypeSchema,
  benefitTypePageSchema,
} from './benefit-type/benefit-type';

// Veteran identification schemas
export {
  veteranFirstNameSchema,
  veteranMiddleNameSchema,
  veteranLastNameSchema,
  veteranFullNameSchema,
  veteranSSNSchema,
  veteranFileNumberSchema,
  veteranServiceNumberSchema,
  veteranDOBSchema,
  isVeteranClaimantSchema,
  veteranIdentificationSchema,
} from './veteran-identification/veteran-identification';

// Claimant identification schemas
export {
  claimantFirstNameSchema,
  claimantMiddleNameSchema,
  claimantLastNameSchema,
  claimantStreetAddressSchema,
  claimantUnitNumberSchema,
  claimantCitySchema,
  claimantStateSchema,
  claimantZipSchema,
  claimantPhoneSchema,
  claimantRelationshipSchema,
  claimantRelationshipOtherSchema,
  claimantIdentificationSchema,
} from './claimant-identification/claimant-identification';

// Hospitalization schemas
export {
  isCurrentlyHospitalizedSchema,
  admissionDateSchema,
  facilityNameSchema,
  facilityStreetAddressSchema,
  facilityCitySchema,
  facilityStateSchema,
  facilityZipSchema,
  hospitalizationSchema,
} from './hospitalization/hospitalization';

// Examiner identification schemas
export {
  examinerNameSchema,
  examinerTitleSchema,
  examinerNPISchema,
  examinerPhoneSchema,
  facilityPracticeNameSchema,
  examinerStreetAddressSchema,
  examinerUnitNumberSchema,
  examinerCitySchema,
  examinerStateSchema,
  examinerZipSchema,
  examinerIdentificationSchema,
} from './examiner-identification/examiner-identification';

// Signature schemas
export {
  claimantSignatureSchema,
  claimantSignatureDateSchema,
  examinationDateSchema,
  examinerSignatureSchema,
  examinerSignatureDateSchema,
  claimantSignaturePageSchema,
  examinerSignaturePageSchema,
} from './signatures/signatures';
