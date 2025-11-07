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
  lastNameSchema,
  veteranInformationSchema,
} from './veteran-information';
export {
  ssnSchema,
  vaFileNumberSchema,
  veteranContactInformationSchema,
} from './veteran-contact-information';
export {
  employerAddressSchema,
  employerInformationSchema,
  employerNameSchema,
} from './employer-information';

/**
 * Section II - Employment Information schemas
 * @description Schemas for validating employment history and termination details
 */
export {
  beginningDateSchema,
  currentlyEmployedSchema,
  employmentDatesSchema,
  endingDateSchema,
} from './employment-dates';
export {
  amountEarnedSchema,
  dailyHoursSchema,
  employmentEarningsHoursSchema,
  timeLostSchema,
  typeOfWorkSchema,
  weeklyHoursSchema,
} from './employment-earnings-hours';
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
export {
  currentDutyStatusSchema,
  disabilitiesPreventDutiesSchema,
  dutyStatusDetailsSchema,
} from './duty-status-details';

/**
 * Section IV - Benefits schemas
 * @description Schemas for validating employment-related benefits information
 */
export {
  benefitEntitlementSchema,
  benefitsInformationSchema,
} from './benefits-information';
export {
  benefitTypeSchema,
  benefitsDetailsSchema,
  firstPaymentDateSchema,
  grossMonthlyAmountSchema,
  startReceivingDateSchema,
  stopReceivingDateSchema,
} from './benefits-details';

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
