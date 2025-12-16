/**
 * @module utils
 * @description Barrel file for utility functions
 * VA Form 21-0779 - Request for Nursing Home Information
 */

export {
  isPatientVeteran,
  isPatientSpouseOrParentOrChild,
} from './patientType';
export { getPatientName } from './patientName';
export { isMedicaidCovered } from './medicaidStatus';
export { formatDate } from './dateFormat';
