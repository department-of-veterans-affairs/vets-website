/* eslint-disable camelcase */
/**
 *
 * Skeleton mocks for VAOS service data responses
 *
 * Avoid depending on the data in specific fields in here in your tests, prefer to
 * set field data in your test function
 *
 * @module testing/mocks/data
 */

export function getSchedulingConfigurationMock({
  id = 'fake',
  typeOfCareId = 'fake',
  requestEnabled = false,
  directEnabled = false,
  patientHistoryRequired = true,
  patientHistoryDuration = 365,
  communityCare = false,
} = {}) {
  return {
    id,
    type: 'scheduling_configuration',
    attributes: {
      facilityId: id,
      services: [
        {
          id: typeOfCareId,
          name: 'Some type of care',
          stopCodes: [],
          direct: {
            patientHistoryRequired,
            patientHistoryDuration,
            enabled: directEnabled,
          },
          request: {
            patientHistoryRequired,
            patientHistoryDuration,
            enabled: requestEnabled,
          },
        },
      ],
      communityCare,
    },
  };
}
