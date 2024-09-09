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
 * @param {...string} params.fields Other fields provided can be any version 2 field. Some are used to set data
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

/**
 * Create mock clinic data
 *
 * @export
 * @param {Object} params
 * @param {string} params.id Clinic id
 * @param {string} params.stationId Full location id (sta6aid)
 * @param {?string} params.name Standard clinic name,
 * @param {?string} params.friendlyName Friendly clinic name,
 *
 * @returns {VAOSClinic} A mock clinic object
 */
export function createMockClinic({
  id = null,
  stationId = null,
  name = null,
  friendlyName = null,
}) {
  return {
    id,
    type: 'clinics',
    attributes: {
      vistaSite: stationId.substr(0, 3),
      id,
      serviceName: friendlyName || name,
      physicalLocation: null,
      phoneNumber: null,
      stationId,
      stationName: null,
      primaryStopCode: null,
      primaryStopCodeName: null,
      secondaryStopCode: null,
      secondaryStopCodeName: null,
      patientDirectScheduling: null,
      patientDisplay: null,
      char4: null,
    },
  };
}

/**
 * Creates a mock VA facility object
 *
 * @export
 * @param {Object} params
 * @param {string} params.id The facility id
 * @param {string} params.name The facility name
 * @param {Address} params.address The facility address, in the FHIR format
 * @param {string} params.phone The facility phone
 * @param {number} params.lat The latitude of the facility
 * @param {number} params.long The longitude of the facility
 * @param {?boolean} params.isParent Is the facility is parent facility or not.
 *
 * @returns {VAFacility} The facility mock with specified data
 */
export function createMockFacility({
  id = 'fake',
  name = 'Fake name',
  address,
  phone = 'fake',
  lat,
  long,
  isParent = null,
} = {}) {
  return {
    id,
    type: 'facility',
    attributes: {
      id,
      vistaSite: id.substring(0, 3),
      vastParent: isParent ? id : id.substring(0, 3),
      name,
      lat,
      long,
      phone: { main: phone },
      physicalAddress: address || {
        line: [],
        city: 'fake',
        state: 'fake',
        postalCode: 'fake',
      },
    },
  };
}

export function createMockCheyenneFacility() {
  return createMockFacility({
    id: '442',
    name: 'Cheyenne VA Medical Center',
    address: {
      postalCode: '82001-5356',
      city: 'Cheyenne',
      state: 'WY',
      line: ['2360 East Pershing Boulevard'],
    },
    phone: '307-778-7550',
  });
}
