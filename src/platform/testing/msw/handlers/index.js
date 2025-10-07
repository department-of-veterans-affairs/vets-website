// Export all handlers
export * from './medications/prescriptions';
export * from './user';
export * from './feature-toggles';

import {
  prescriptionsHandler,
  prescriptionDetailsHandler,
  refillablePrescriptionsHandler,
  refillPrescriptionHandler,
  prescriptionDocumentationHandler,
} from './medications/prescriptions';
import { userHandler, personalInformationHandler } from './user';
import { featureTogglesHandler } from './feature-toggles';

/**
 * Default handlers for common endpoints
 * These are used by default in the MSW server and browser worker
 */
export const defaultHandlers = [
  userHandler(),
  featureTogglesHandler(),
  prescriptionsHandler(),
  prescriptionDetailsHandler(),
  refillablePrescriptionsHandler(),
  refillPrescriptionHandler(),
  prescriptionDocumentationHandler(),
  personalInformationHandler(),
];
