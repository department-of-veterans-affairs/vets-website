/**
 * @module schemas
 * @description Main schema exports for VA Form 21-4192 - Request for Employment Information.
 * This module consolidates all validation schemas used throughout the form
 * to ensure data integrity and proper validation of employer and veteran information.
 */

// Import individual schemas when created
// import { employmentDetailsSchema } from './employment-details';
// import { terminationInformationSchema } from './termination-information';
// import { benefitsInformationSchema } from './benefits-information';
// import { reserveGuardStatusSchema } from './reserve-guard-status';
// import { certificationSchema } from './certification';

/**
 * Section I - Identification schemas
 * @description Schemas for validating employer and veteran identification
 */
export {
  dateOfBirthSchema,
  firstNameSchema,
  fullNameSchema,
  lastNameSchema,
  middleNameSchema,
  ssnSchema,
  vaFileNumberSchema,
  veteranInformationSchema,
} from './veteran-information';
export {
  employerAddressSchema,
  employerInformationSchema,
  employerNameSchema,
  phoneNumberSchema,
} from './employer-information';

/**
 * Section II - Employment Information schemas
 * @description Schemas for validating employment history and termination details
 */
export {
  amountEarnedSchema,
  beginningDateSchema,
  dailyHoursSchema,
  employmentDatesDetailsSchema,
  endingDateSchema,
  timeLostSchema,
  typeOfWorkSchema,
  weeklyHoursSchema,
} from './employment-dates-details';
export {
  concessionsSchema,
  employmentConcessionsSchema,
} from './employment-concessions';
export {
  dateLastWorkedSchema,
  employmentTerminationSchema,
  terminationReasonSchema,
} from './employment-termination';
export {
  dateOfLastPaymentSchema,
  datePaidSchema,
  employmentLastPaymentSchema,
  grossAmountLastPaymentSchema,
  grossAmountPaidSchema,
  lumpSumPaymentSchema,
} from './employment-last-payment';

/**
 * Section III - Reserve/Guard schemas
 * @description Schemas for validating Reserve or National Guard status
 */
export { dutyStatusSchema, reserveOrGuardStatusSchema } from './duty-status';

/**
 * Section IV - Benefits schemas
 * @description Schemas for validating employment-related benefits information
 */
export {
  benefitEntitlementSchema,
  benefitsInformationSchema,
} from './benefits-information';

/**
 * Section V - Remarks schemas
 * @description Schemas for validating additional remarks or comments
 */
export { remarksFieldSchema, remarksSchema } from './remarks';

/**
 * Certification schemas
 * @description Schemas for validating employer certification and signature
 */
// export {
//   certificationSchema,
// };

/**
 * Complete form schema for VA Form 21-4192
 * @description Composite schema that validates the entire employment information form.
 * This schema combines all section schemas to ensure complete form validation
 * for employment verification in support of disability claims.
 */
// export const employmentInformationFormSchema = z.object({
//   employerInformation: employerInformationSchema,
//   veteranInformation: veteranInformationSchema,
//   employmentDetails: employmentDetailsSchema,
//   terminationInformation: terminationInformationSchema.optional(),
//   benefitsInformation: benefitsInformationSchema.optional(),
//   reserveGuardStatus: reserveGuardStatusSchema.optional(),
//   certification: certificationSchema,
// });

// Export empty object for now to prevent import errors
export default {};
