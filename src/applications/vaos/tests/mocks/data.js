/**
 * @module testing/mocks/data
 */
import moment from '../../lib/moment-tz';

/**
 * Creates a mock appointment record, based on the data provided.
 *
 * @export
 * @param {Object} params
 * @param {?string} params.id The appointment id
 * @param {?string} params.email The email address used
 * @param {?string} params.phone The phone number used
 * @param {PPMSProvider} params.communityCareProvider The community care provider to use. Info aside from
 *   uniqueId is discarded in version 2
 * @param {string} params.fields Other fields provided can be any version 2 field. Some are used to set data
 *   on the version 0 output (kind, start, etc) and all are merged into the v2 output
 * @returns {VAOSAppointment} An appointment object in the specified format
 */
export function createMockAppointment({
  id = null,
  email = null,
  phone = null,
  communityCareProvider = null,
  ...fields
} = {}) {
  return {
    id,
    type: 'appointments',
    attributes: {
      id,
      cancelationReason: null,
      clinic: null,
      comment: null,
      contact: {
        telecom: [
          { type: 'phone', value: phone },
          { type: 'email', value: email },
        ],
      },
      description: null,
      end: null,
      kind: null,
      locationId: null,
      minutesDuration: null,
      patientInstruction: 'Video Visit Preparation plus extra data',
      practitioners: communityCareProvider
        ? [
            {
              identifier: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  value: communityCareProvider.uniqueId,
                },
              ],
            },
          ]
        : null,
      preferredTimesForPhoneCall: null,
      priority: null,
      reasonCode: {},
      requestedPeriods: null,
      serviceType: null,
      slot: null,
      start:
        fields.kind === 'cc' && !fields.requestedPeriods?.length
          ? moment(fields.start)
              .utc()
              .format()
          : null,
      status: null,
      telehealth: null,
      extension: {
        ccLocation: communityCareProvider,
      },
      ...fields,
    },
  };
}
