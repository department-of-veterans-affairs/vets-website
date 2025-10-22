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

// Claimant relationship schemas
export {
  claimantRelationshipSchema,
  claimantRelationshipPageSchema,
} from './claimant-relationship/claimant-relationship';

// Veteran identification schemas
export {
  veteranSSNSchema,
  veteranFileNumberSchema,
  veteranServiceNumberSchema,
  veteranDOBSchema,
  isVeteranClaimantSchema,
  veteranIdentificationPageSchema,
  veteranIdentificationSchema,
} from './veteran-identification/veteran-identification';

// Veteran address schemas
export {
  veteranAddressSchema,
  veteranAddressPageSchema,
} from './veteran-address/veteran-address';

// Claimant information schemas (name and DOB)
export {
  claimantDOBSchema,
  claimantInformationPageSchema,
} from './claimant-information/claimant-information';

// Claimant SSN schemas
export {
  claimantSSNSchema,
  claimantSSNPageSchema,
} from './claimant-ssn/claimant-ssn';

// Claimant address schemas
export {
  claimantAddressSchema,
  claimantAddressPageSchema,
} from './claimant-address/claimant-address';

// Claimant contact schemas
export {
  claimantPhoneNumberSchema,
  claimantMobilePhoneSchema,
  claimantEmailSchema,
  claimantContactPageSchema,
} from './claimant-contact/claimant-contact';

// Hospitalization schemas
export {
  isCurrentlyHospitalizedSchema,
  admissionDateSchema,
  facilityNameSchema,
  facilityStreetAddressSchema,
  facilityCitySchema,
  facilityStateSchema,
  facilityZipSchema,
  hospitalizationStatusPageSchema,
  hospitalizationDatePageSchema,
  hospitalizationFacilityPageSchema,
  hospitalizationSchema,
} from './hospitalization/hospitalization';
