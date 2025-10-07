import {
  prescriptionsHandler,
  prescriptionDetailsHandler,
  refillablePrescriptionsHandler,
  refillPrescriptionHandler,
  prescriptionsErrorHandler,
} from '../handlers/medications/prescriptions';

/**
 * Medication scenarios - reusable combinations of handlers
 * representing common application states
 */
export const medications = {
  /**
   * User with active prescriptions
   */
  withActiveRx: (options = {}) => [
    prescriptionsHandler({
      count: options.count ?? 10,
      status: 'Active',
      ...options,
    }),
    prescriptionDetailsHandler({ dispStatus: 'Active' }),
    refillablePrescriptionsHandler({ count: options.refillableCount ?? 5 }),
    refillPrescriptionHandler(),
  ],

  /**
   * User with refillable prescriptions
   */
  withRefillable: (count = 5) => [
    prescriptionsHandler({ count, refillable: true }),
    refillablePrescriptionsHandler({ count }),
    refillPrescriptionHandler({ allSuccess: true }),
  ],

  /**
   * User with no prescriptions
   */
  empty: () => [
    prescriptionsHandler({ count: 0 }),
    refillablePrescriptionsHandler({ count: 0 }),
  ],

  /**
   * User with expired prescriptions
   */
  withExpired: (count = 5) => [
    prescriptionsHandler({
      count,
      dispStatus: 'Expired',
      refillable: false,
      expirationDate: '2020-01-01T00:00:00-05:00',
    }),
    refillablePrescriptionsHandler({ count: 0 }),
  ],

  /**
   * Mix of active and refillable prescriptions
   */
  mixed: () => [
    prescriptionsHandler({ count: 15 }),
    refillablePrescriptionsHandler({ count: 8 }),
    refillPrescriptionHandler(),
  ],

  /**
   * Prescription with refill in process
   */
  refillInProcess: () => [
    prescriptionsHandler({
      count: 5,
      dispStatus: 'Active: Refill in Process',
    }),
    prescriptionDetailsHandler({
      dispStatus: 'Active: Refill in Process',
    }),
    refillablePrescriptionsHandler({ count: 0 }),
  ],

  /**
   * Single prescription details (for details page)
   */
  singlePrescription: (attrs = {}) => [
    prescriptionDetailsHandler(attrs),
  ],

  /**
   * Error states
   */
  error: (statusCode = 500) => [prescriptionsErrorHandler(statusCode)],

  /**
   * Slow response (for loading state testing)
   */
  slow: () => [
    prescriptionsHandler({ delay: 5000 }),
    refillablePrescriptionsHandler({ delay: 5000 }),
  ],

  /**
   * Refill failure scenario
   */
  refillFailure: () => [
    prescriptionsHandler({ count: 5, refillable: true }),
    refillablePrescriptionsHandler({ count: 5 }),
    refillPrescriptionHandler({ allSuccess: false }),
  ],

  /**
   * Refill success scenario
   */
  refillSuccess: () => [
    prescriptionsHandler({ count: 5, refillable: true }),
    refillablePrescriptionsHandler({ count: 5 }),
    refillPrescriptionHandler({ allSuccess: true }),
  ],
};
