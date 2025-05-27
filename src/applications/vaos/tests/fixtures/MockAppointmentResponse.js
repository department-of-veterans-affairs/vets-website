// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import { addHours, format, startOfDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  APPOINTMENT_STATUS,
  DATE_FORMATS,
  TYPE_OF_VISIT_ID,
  VIDEO_TYPES,
} from '../../utils/constants';

/**
 * Mock appointment response.
 *
 * @export
 * @class MockAppointmentResponse
 */
export default class MockAppointmentResponse {
  /**
   * Creates an instance of MockAppointmentResponse.
   *
   * @param {Object} props - Properties used to determine what type of mock appointment to create.
   * @param {boolean} [props.future=false] - Flag to determine if appointment is a future appointment.
   * @param {string|number} [props.id=1] - Appointment id. Default = 1
   * @param {Date} props.localStartTime - Appointment start time.
   * @param {string} [props.locationId] - Appointment location id.
   * @param {boolean} [props.past=false] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [props.pending=false] - Flag to determine if appointment is a pending appointment.
   * @param {string} [props.status=booked] - Appointment status. If appointment status is 'APPOINTMENT_STATUS.proposed', localStart time is used for requested periods. Default = APPOINTMENT_STATUS.booked.
   * @memberof MockAppointmentResponse
   */
  constructor({
    future = false,
    id = '1',
    localStartTime,
    locationId = '983',
    past = false,
    pending = false,
    status = 'booked',
  } = {}) {
    const requestedPeriods = [];
    let timestamp = new Date();
    let createdStamp = new Date();

    if (localStartTime && localStartTime instanceof Date)
      timestamp = localStartTime;

    if (status === APPOINTMENT_STATUS.proposed) {
      requestedPeriods.push({
        start: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss.000'Z'"),
        end: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss.000'Z'"),
      });
    } else createdStamp = format(timestamp, "yyyy-MM-dd'T'HH:mm:ss.000'Z'");

    this.id = id.toString();
    this.type = 'MockAppointment';
    this.attributes = {
      id,
      locationId,
      cancellable: false,
      extension: {
        patientHasMobileGfe: false,
      },
      kind: TYPE_OF_VISIT_ID.clinic,
      type: 'VA',
      localStartTime:
        status === APPOINTMENT_STATUS.proposed
          ? null
          : format(timestamp, "yyyy-MM-dd'T'HH:mm:ss.000'Z'"),
      modality: 'vaInPerson',
      preferredDates: [
        format(
          startOfDay(new Date(), 'day'),
          "eeee, MMMM d, yyyy 'in the morning'",
        ),
      ],
      requestedPeriods:
        requestedPeriods.length > 0 ? requestedPeriods : undefined,
      created: createdStamp,
      serviceType: 'primaryCare',
      start:
        status === APPOINTMENT_STATUS.proposed
          ? null
          : formatInTimeZone(timestamp, 'UTC', DATE_FORMATS.ISODateTimeUTC),
      status,
      telehealth: {
        atlas: null,
        url: null,
        vvsKind: null,
        displayLink: false,
      },
      future,
      pending,
      past,
    };
  }

  /**
   * Method to generate mock Atlas response objects.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {Date} [arguments.localStartTime] - Local start time.
   * @param {boolean} [arguments.future] - Flag to determine if appointment is a future appointment.
   * @param {boolean} [arguments.past] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [arguments.pending] - Flag to determine if appointment is a pending appointment.
   * @param {number} [arguments.count] - Number of MockAppointmentResponse objects to generate. Default = 1.
   * @returns Array of MockAppointmentResponse objects
   * @memberof MockAppointmentResponse
   */
  static createAtlasResponses({
    localStartTime,
    future = false,
    past = false,
    count = 1,
  } = {}) {
    return Array(count)
      .fill(count)
      .map((_, index) => {
        return new MockAppointmentResponse({
          id: index + 1,
          localStartTime,
          future,
          past,
        })
          .setAtlas({
            confirmationCode: '7VBBCA',
            address: {
              streetAddress: '114 Dewey Ave',
              city: 'Eureka',
              state: 'MT',
              zipCode: '59917',
            },
          })
          .setKind(TYPE_OF_VISIT_ID.telehealth)
          .setModality('vaVideoCareAtAnAtlasLocation')
          .setVvsKind(VIDEO_TYPES.adhoc);
      });
  }

  /**
   * Method to generate mock Community Care response objects.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {Date} [arguments.localStartTime] - Local start time.
   * @param {boolean} [arguments.future] - Flag to determine if appointment is a future appointment.
   * @param {boolean} [arguments.past] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [arguments.pending] - Flag to determine if appointment is a pending appointment.
   * @param {number} [arguments.count] - Number of MockAppointmentResponse objects to generate. Default = 1.
   * @returns Array of MockAppointmentResponse objects
   * @memberof MockAppointmentResponse
   */
  static createCCResponses({
    count = 1,
    future,
    localStartTime,
    past,
    pending,
    status,
  } = {}) {
    return Array(count)
      .fill(count)
      .map((_, index) => {
        return new MockAppointmentResponse({
          id: index + 1,
          localStartTime,
          future,
          past,
          pending,
          status: status || APPOINTMENT_STATUS.proposed,
        })
          .setKind('cc')
          .setModality('communityCare')
          .setType(
            pending || status === APPOINTMENT_STATUS.proposed
              ? 'COMMUNITY_CARE_REQUEST'
              : 'COMMUNITY_CARE_APPOINTMENT',
          );
      });
  }

  /**
   * Method to generate mock Community Care response objects.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {Date} [arguments.localStartTime] - Local start time.
   * @param {boolean} [arguments.future] - Flag to determine if appointment is a future appointment.
   * @param {boolean} [arguments.past] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [arguments.pending] - Flag to determine if appointment is a pending appointment.
   * @returns Array of MockAppointmentResponse objects
   * @memberof MockAppointmentResponse
   */
  static createCCResponse({
    future,
    localStartTime,
    past,
    pending,
    status,
  } = {}) {
    return this.createCCResponses({
      count: 1,
      future,
      localStartTime,
      past,
      pending,
      status,
    })[0];
  }

  /**
   * Method to generate mock Clinic response objects.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {Date} [arguments.localStartTime] - Local start time.
   * @param {boolean} [arguments.future] - Flag to determine if appointment is a future appointment.
   * @param {boolean} [arguments.past] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [arguments.pending] - Flag to determine if appointment is a pending appointment.
   * @param {number} [arguments.count] - Number of MockAppointmentResponse objects to generate. Default = 1.
   * @returns Array of MockAppointmentResponse objects
   * @memberof MockAppointmentResponse
   */
  static createClinicResponses({
    localStartTime,
    future = false,
    past = false,
    count = 1,
  } = {}) {
    return Array(count)
      .fill(count)
      .map((_, index) =>
        new MockAppointmentResponse({
          id: index + 1,
          localStartTime,
          future,
          past,
        })
          .setKind(TYPE_OF_VISIT_ID.telehealth)
          .setModality('vaVideoCareAtAVaLocation')
          .setType('COMMUNITY_CARE_APPOINTMENT')
          .setVvsKind(VIDEO_TYPES.clinic),
      );
  }

  /**
   * Method to generate mock GFE response objects.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {Date} [arguments.localStartTime] - Local start time.
   * @param {boolean} [arguments.future] - Flag to determine if appointment is a future appointment.
   * @param {boolean} [arguments.past] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [arguments.pending] - Flag to determine if appointment is a pending appointment.
   * @param {number} [arguments.count] - Number of MockAppointmentResponse objects to generate. Default = 1.
   * @returns Array of MockAppointmentResponse objects
   * @memberof MockAppointmentResponse
   */
  static createGfeResponses({
    localStartTime,
    future = false,
    past = false,
    count = 1,
  } = {}) {
    return Array(count)
      .fill(count)
      .map((_, index) =>
        new MockAppointmentResponse({
          id: index + 1,
          localStartTime,
          future,
          past,
        })
          .setKind(TYPE_OF_VISIT_ID.telehealth)
          .setModality('vaVideoCareAtHome')
          .setPatientHasMobileGfe(true)
          .setVvsKind(VIDEO_TYPES.mobile),
      );
  }

  /**
   * Method to generate mock VA response objects.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {Date} [arguments.localStartTime] - Local start time.
   * @param {boolean} [arguments.future] - Flag to determine if appointment is a future appointment.
   * @param {boolean} [arguments.past] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [arguments.pending] - Flag to determine if appointment is a pending appointment.
   * @param {number} [arguments.count] - Number of MockAppointmentResponse objects to generate. Default = 1.
   * @returns Array of MockAppointmentResponse objects
   * @memberof MockAppointmentResponse
   */
  static createMobileResponses({ localStartTime, future = false, count = 1 }) {
    return Array(count)
      .fill(count)
      .map((_, index) =>
        new MockAppointmentResponse({
          id: index + 1,
          localStartTime,
          future,
        })
          .setKind(TYPE_OF_VISIT_ID.telehealth)
          .setModality('vaVideoCareAtHome')
          .setVvsKind(VIDEO_TYPES.mobile),
      );
  }

  /**
   * Method to generate mock Phone response objects.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {Date} [arguments.localStartTime] - Local start time.
   * @param {boolean} [arguments.future] - Flag to determine if appointment is a future appointment.
   * @param {boolean} [arguments.past] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [arguments.pending] - Flag to determine if appointment is a pending appointment.
   * @param {number} [arguments.count] - Number of MockAppointmentResponse objects to generate. Default = 1.
   * @returns Array of MockAppointmentResponse objects
   * @memberof MockAppointmentResponse
   */
  static createPhoneResponses({
    localStartTime,
    future = false,
    count = 1,
  } = {}) {
    return Array(count)
      .fill(count)
      .map((_, index) =>
        new MockAppointmentResponse({
          id: index + 1,
          localStartTime,
          future,
        })
          .setKind(TYPE_OF_VISIT_ID.phone)
          .setModality('vaPhone'),
      );
  }

  /**
   * Method to generate mock Store Forward response objects.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {Date} [arguments.localStartTime] - Local start time.
   * @param {boolean} [arguments.future] - Flag to determine if appointment is a future appointment.
   * @param {boolean} [arguments.past] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [arguments.pending] - Flag to determine if appointment is a pending appointment.
   * @param {number} [arguments.count] - Number of MockAppointmentResponse objects to generate. Default = 1.
   * @returns Array of MockAppointmentResponse objects
   * @memberof MockAppointmentResponse
   */
  static createStoreForwardResponses({
    localStartTime,
    future = false,
    count = 1,
  } = {}) {
    return Array(count)
      .fill(count)
      .map((_, index) =>
        new MockAppointmentResponse({
          id: index + 1,
          localStartTime,
          future,
        })
          .setKind(TYPE_OF_VISIT_ID.telehealth)
          .setModality('vaVideoCareAtHome')
          .setVvsKind(VIDEO_TYPES.storeForward),
      );
  }

  /**
   * Method to generate mock VA response objects.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {Date} [arguments.localStartTime] - Local start time.
   * @param {boolean} [arguments.future] - Flag to determine if appointment is a future appointment.
   * @param {boolean} [arguments.past] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [arguments.pending] - Flag to determine if appointment is a pending appointment.
   * @param {number} [arguments.count] - Number of MockAppointmentResponse objects to generate. Default = 1.
   * @returns Array of MockAppointmentResponse objects
   * @memberof MockAppointmentResponse
   */
  static createVAResponses({
    localStartTime = new Date(),
    future,
    past,
    pending,
    count = 1,
    status,
  } = {}) {
    return Array(count)
      .fill(count)
      .map((_, index) => {
        return new MockAppointmentResponse({
          id: index + 1,
          future,
          localStartTime,
          past,
          pending,
          status: `${
            pending === true && status !== APPOINTMENT_STATUS.cancelled
              ? APPOINTMENT_STATUS.proposed
              : status
          }`,
        }).setType(
          pending || status === APPOINTMENT_STATUS.proposed ? 'REQUEST' : 'VA',
        );
      });
  }

  /**
   * Method to generate mock VA response object.
   *
   * @static
   * @param {Object} arguments - Method arguments.
   * @param {Date} [arguments.localStartTime] - Local start time.
   * @param {boolean} [arguments.future] - Flag to determine if appointment is a future appointment.
   * @param {boolean} [arguments.past] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [arguments.pending] - Flag to determine if appointment is a pending appointment.
   * @returns Array of MockAppointmentResponse objects
   * @memberof MockAppointmentResponse
   */
  static createVAResponse({
    localStartTime = new Date(),
    future,
    past,
    pending,
    status,
  } = {}) {
    return this.createVAResponses({
      count: 1,
      localStartTime,
      future,
      past,
      pending,
      status,
    })[0];
  }

  setAtlas(value) {
    this.attributes.telehealth.atlas = value;
    return this;
  }

  setCancellable(value) {
    this.attributes.cancellable = value;
    return this;
  }

  setCancelled(value) {
    this.attributes.cancellable = value;
    return this;
  }

  setCancelationReason(value) {
    this.attributes.cancelationReason = {
      coding: [{ code: value }],
    };

    return this;
  }

  setCCProvider() {
    this.attributes.extension = {
      ccLocation: {
        address: {
          line: ['Address line 1'],
          city: 'City',
          state: 'State',
          postalCode: '12345',
          text: '10640 MAIN ST ; STE 100\nFAIRFAX VA 22030',
        },
        telecom: [
          {
            system: 'phone',
            value: '123-456-7890',
          },
        ],
      },
      ccTreatingSpecialty: 'Treating specialty',
    };

    return this;
  }

  setClinicId(id) {
    this.attributes.clinic = id;
    return this;
  }

  setCreated(value) {
    this.attributes.created = value;
    return this;
  }

  setFuture(value) {
    this.attributes.future = value;
    return this;
  }

  setDisplayLink(value) {
    this.attributes.telehealth.displayLink = value;
    return this;
  }

  setContact({ phone, email }) {
    this.attributes.contact = {
      telecom: [
        { type: 'phone', value: phone },
        { type: 'email', value: email },
      ],
    };

    return this;
  }

  setId(value) {
    this.id = value.toString();
    return this;
  }

  setKind(value) {
    this.attributes.kind = value;
    return this;
  }

  setLocalStart(value) {
    this.attributes.localStartTime = value;
    return this;
  }

  /**
   *
   *
   * @param {MockFacilityResponse} value
   * @returns
   * @memberof MockAppointmentResponse
   */
  setLocation(value) {
    this.attributes.location = value;
    return this;
  }

  setLocationId(value) {
    this.attributes.locationId = value.toString();
    return this;
  }

  setModality(value) {
    this.attributes.modality = value;
    return this;
  }

  setPast(value) {
    this.attributes.past = value;
    return this;
  }

  setPatientHasMobileGfe(value) {
    this.attributes.extension.patientHasMobileGfe = value;
    return this;
  }

  setPatientComments(value) {
    this.attributes.patientComments = value;
    return this;
  }

  setPending(value) {
    this.attributes.pending = value;
    return this;
  }

  setPhysicalLocation(room) {
    this.attributes.physicalLocation = room;
    return this;
  }

  setPractitioner({ id }) {
    this.attributes.practitioners = [
      {
        identifier: [
          {
            system: 'http://hl7.org/fhir/sid/us-npi',
            value: id,
          },
        ],
        address: {
          line: ['line 1'],
          city: 'City',
          state: 'State',
          postalCode: 'Postal code',
        },
      },
    ];

    return this;
  }

  setPreferredDates(values) {
    this.attributes.preferredDates = values;
    return this;
  }

  setPreferredModlity(value) {
    this.attributes.preferredModality = value;
    return this;
  }

  setPreferredProviderName(value) {
    this.attributes.preferredProviderName = value;
    return this;
  }

  setPreferredTimesForPhoneCall({ morning, afternoon, evening }) {
    const array = [];

    if (morning) array.push('Morning');
    if (afternoon) array.push('Afternoon');
    if (evening) array.push('Evening');

    this.attributes.preferredTimesForPhoneCall = array;

    return this;
  }

  setReasonCode({ code, text }) {
    this.attributes.reasonCode = {
      coding: [{ code }],
      text,
    };

    return this;
  }

  getRequestedPeriods() {
    if (!this.attributes.requestedPeriods)
      throw new Error('Attribute not defined');

    return this.attributes.requestedPeriods;
  }

  /**
   * Method to set requested periods
   *
   * @param {Array<Date>} values Array of requested period dates.
   * @returns MockAppointmentResponse instance
   * @memberof MockAppointmentResponse
   */
  setRequestedPeriods(values) {
    this.attributes.requestedPeriods = values.map(date => {
      return {
        start: format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        end: format(addHours(date, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      };
    });

    return this;
  }

  setStart(value) {
    this.attributes.start = value;
    return this;
  }

  setStatus(value) {
    this.attributes.status = value;
    return this;
  }

  /**
   * Set travel pay claim attribute.
   *
   * @param {MockTravelPayClaim} value
   * @returns
   * @memberof MockAppointmentResponse
   */
  setTravelPayClaim(value) {
    this.attributes.travelPayClaim = value;
    return this;
  }

  setType(value) {
    this.attributes.type = value;
    return this;
  }

  setTypeOfCare(value) {
    this.attributes.serviceType = value;
    return this;
  }

  setUrl(value = 'test.com') {
    this.attributes.telehealth = {
      ...this.attributes.telehealth,
      url: value,
    };

    return this;
  }

  setVvsKind(value) {
    this.attributes.telehealth.vvsKind = value;
    return this;
  }
}
