/**
 * @module schemas
 * @description Main schema exports for VA Form 21-4192 - Request for Employment Information.
 * This module consolidates all validation schemas used throughout the form
 * to ensure data integrity and proper validation of employer and veteran information.
 */

// Import individual schemas when created
<<<<<<< HEAD
=======
// import { employerInformationSchema } from './employer-information';
// import { veteranInformationSchema } from './veteran-information';
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
// import { employmentDetailsSchema } from './employment-details';
// import { terminationInformationSchema } from './termination-information';
// import { benefitsInformationSchema } from './benefits-information';
// import { reserveGuardStatusSchema } from './reserve-guard-status';
// import { certificationSchema } from './certification';

/**
 * Section I - Identification schemas
 * @description Schemas for validating employer and veteran identification
 */
<<<<<<< HEAD
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
=======
// export {
//   employerInformationSchema,
//   veteranInformationSchema,
// };
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

/**
 * Section II - Employment Information schemas
 * @description Schemas for validating employment history and termination details
 */
<<<<<<< HEAD
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
=======
// export {
//   employmentDetailsSchema,
//   terminationInformationSchema,
// };
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

/**
 * Section III - Reserve/Guard schemas
 * @description Schemas for validating Reserve or National Guard status
 */
<<<<<<< HEAD
export { dutyStatusSchema, reserveOrGuardStatusSchema } from './duty-status';
=======
// export {
//   reserveGuardStatusSchema,
// };
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

/**
 * Section IV - Benefits schemas
 * @description Schemas for validating employment-related benefits information
 */
<<<<<<< HEAD
export {
  benefitEntitlementSchema,
  benefitsInformationSchema,
} from './benefits-information';

/**
 * Section V - Remarks schemas
 * @description Schemas for validating additional remarks or comments
 */
export { remarksFieldSchema, remarksSchema } from './remarks';
=======
// export {
//   benefitsInformationSchema,
// };
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

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
