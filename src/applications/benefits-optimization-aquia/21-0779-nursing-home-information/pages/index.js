/**
 * @module pages
 * @description Barrel file for all form page configurations
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

// Nursing Official Personal Chapter
export {
  nursingOfficialInformationUiSchema,
  nursingOfficialInformationSchema,
} from './nursing-official-information';

// Nursing Home Chapter
export {
  nursingHomeDetailsUiSchema,
  nursingHomeDetailsSchema,
} from './nursing-home-details';

// Patient Information Chapter
export {
  claimantQuestionUiSchema,
  claimantQuestionSchema,
} from './claimant-question';

export {
  claimantPersonalInfoUiSchema,
  claimantPersonalInfoSchema,
} from './claimant-personal-info';

export {
  claimantIdentificationInfoUiSchema,
  claimantIdentificationInfoSchema,
} from './claimant-identification-info';

export {
  veteranPersonalInfoUiSchema,
  veteranPersonalInfoSchema,
} from './veteran-personal-info';

export {
  veteranIdentificationInfoUiSchema,
  veteranIdentificationInfoSchema,
} from './veteran-identification-info';

// Level of Care Chapter
export {
  certificationLevelOfCareUiSchema,
  certificationLevelOfCareSchema,
} from './certification-level-of-care';

export { admissionDateUiSchema, admissionDateSchema } from './admission-date';

// Medicaid Chapter
export {
  medicaidFacilityUiSchema,
  medicaidFacilitySchema,
} from './medicaid-facility';

export {
  medicaidApplicationUiSchema,
  medicaidApplicationSchema,
} from './medicaid-application';

export {
  medicaidStatusUiSchema,
  medicaidStatusSchema,
} from './medicaid-status';

export {
  medicaidStartDateUiSchema,
  medicaidStartDateSchema,
} from './medicaid-start-date';

// Costs Chapter
export { monthlyCostsUiSchema, monthlyCostsSchema } from './monthly-costs';
