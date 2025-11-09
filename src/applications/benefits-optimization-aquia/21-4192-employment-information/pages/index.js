/**
 * @module pages
 * @description Barrel file for all form page configurations
 * VA Form 21-4192 - Request for Employment Information
 */

// Veteran Information Chapter
export {
  veteranInformationUiSchema,
  veteranInformationSchema,
} from './veteran-information';

export {
  veteranContactInformationUiSchema,
  veteranContactInformationSchema,
} from './veteran-contact-information';

// Employer Information Chapter
export {
  employerInformationUiSchema,
  employerInformationSchema,
} from './employer-information';

// Employment Information Chapter
export {
  employmentDatesUiSchema,
  employmentDatesSchema,
} from './employment-dates';

export {
  employmentEarningsHoursUiSchema,
  employmentEarningsHoursSchema,
} from './employment-earnings-hours';

export {
  employmentConcessionsUiSchema,
  employmentConcessionsSchema,
} from './employment-concessions';

export {
  employmentTerminationUiSchema,
  employmentTerminationSchema,
} from './employment-termination';

export {
  employmentLastPaymentUiSchema,
  employmentLastPaymentSchema,
} from './employment-last-payment';

// Duty Status Chapter
export { dutyStatusUiSchema, dutyStatusSchema } from './duty-status';

export {
  dutyStatusDetailsUiSchema,
  dutyStatusDetailsSchema,
} from './duty-status-details';

// Benefits Information Chapter
export {
  benefitsInformationUiSchema,
  benefitsInformationSchema,
} from './benefits-information';

export {
  benefitsDetailsUiSchema,
  benefitsDetailsSchema,
} from './benefits-details';

// Remarks Chapter
export { remarksUiSchema, remarksSchema } from './remarks';
