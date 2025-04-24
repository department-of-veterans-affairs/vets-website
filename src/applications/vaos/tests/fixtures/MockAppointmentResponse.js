// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import { addHours, format, startOfDay } from 'date-fns';
import {
  APPOINTMENT_STATUS,
  TYPE_OF_VISIT_ID,
  VIDEO_TYPES,
} from '../../utils/constants';

/**
 * Mock appointment response.
 *
 * @export
 * @class MockAppointment
 */
export default class MockAppointmentResponse {
  /**
   * Creates an instance of MockAppointment.
   * @param {Object} props - Properties used to determine what type of mock appointment to create.
   * @param {Object=} props.atlas - Set this to create an atlas appointment.
   * @param {Date} props.localStartTime - Set appointment start time.
   * @param {Date} [props.created=null] - Set appointment created date to the value passed in otherwise set the date to today's date as the default.
   * @param {string=} props.url - Set video appointment URL.
   * @param {string=} props.vvsKind - Set type of video appointment.
   * @param {string|number} [props.id=1] - Set appointment id.
   * @param {boolean} [props.cancellable=true] - Set if appointment is cancellable.
   * @param {string|TYPE_OF_VISIT_ID} [props.kind=clinic] - Set if appointment is VA or CC appointment.
   * @param {boolean} [props.patientHasMobileGfe=false] - Set if patient has mobile device for video appointments.
   * @param {string} [props.serviceType=primaryCare] - Set appointment type of care.
   * @param {string} [props.status=booked] - Set appointment status. If appointment status is 'APPOINTMENT_STATUS.proposed', localStart time is used for requested periods.
   * @param {boolean} [props.past=false] - Flag to determine if appointment is a past appointment.
   * @param {boolean} [props.pending=false] - Flag to determine if appointment is a pending appointment.
   * @param {boolean} [props.future=false] - Flag to determine if appointment is a pending appointment.
   * @memberof MockAppointment
   */
  constructor({
    atlas,
    localStartTime,
    url,
    vvsKind,
    cancellable = true,
    created = null,
    future = false,
    id = '1',
    kind = TYPE_OF_VISIT_ID.clinic,
    modality = 'vaInPerson',
    past = false,
    patientHasMobileGfe = false,
    pending = false,
    serviceType = 'primaryCare',
    status = 'booked',
    type = 'VA',
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
    }

    if (created && created instanceof Date)
      createdStamp = format(created, "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
    else createdStamp = format(timestamp, "yyyy-MM-dd'T'HH:mm:ss.000'Z'");

    this.id = id.toString();
    this.type = 'MockAppointment';
    this.attributes = {
      id,
      cancellable,
      extension: {
        patientHasMobileGfe,
      },
      kind,
      type,
      localStartTime: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss.000'Z'"),
      modality,
      preferredDates: [
        format(
          startOfDay(new Date(), 'day'),
          "eeee, MMMM d, yyyy '[in the morning]'",
        ),
      ],
      requestedPeriods:
        requestedPeriods.length > 0 ? requestedPeriods : undefined,
      created: createdStamp,
      serviceType,
      status,
      telehealth: {
        atlas,
        url,
        vvsKind,
      },
      future,
      pending,
      past,
    };
  }

  static createAtlasResponses({
    localStartTime,
    future = false,
    past = false,
    count = 1,
  }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            type: 'VA',
            modality: 'vaVideoCareAtAnAtlasLocation',
            localStartTime,
            atlas: {
              confirmationCode: '7VBBCA',
              address: {
                streetAddress: '114 Dewey Ave',
                city: 'Eureka',
                state: 'MT',
                zipCode: '59917',
              },
            },
            vvsKind: VIDEO_TYPES.adhoc,
            future,
            past,
          }),
      );
  }

  static createCCResponses({ localStartTime, future = false, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: 'cc',
            type: 'COMMUNITY_CARE_APPOINTMENT',
            modality: 'communityCare',
            localStartTime,
            future,
          }),
      );
  }

  static createClinicResponses({
    localStartTime,
    future = false,
    past = false,
    count = 1,
  }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            type: 'VA',
            modality: 'vaVideoCareAtAVaLocation',
            localStartTime,
            vvsKind: VIDEO_TYPES.clinic,
            future,
            past,
          }),
      );
  }

  static createGfeResponses({
    localStartTime,
    future = false,
    past = false,
    count = 1,
  }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            type: 'VA',
            modality: 'vaVideoCareAtHome',
            localStartTime,
            vvsKind: VIDEO_TYPES.mobile,
            patientHasMobileGfe: true,
            future,
            past,
          }),
      );
  }

  static createMobileResponses({ localStartTime, future = false, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            type: 'VA',
            modality: 'vaVideoCareAtHome',
            localStartTime,
            vvsKind: VIDEO_TYPES.mobile,
            future,
          }),
      );
  }

  static createPhoneResponses({ localStartTime, future = false, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.phone,
            type: 'VA',
            modality: 'vaPhone',
            localStartTime,
            future,
          }),
      );
  }

  static createStoreForwardResponses({
    localStartTime,
    future = false,
    count = 1,
  }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            type: 'VA',
            modality: 'vaVideoCareAtHome',
            localStartTime,
            vvsKind: VIDEO_TYPES.storeForward,
            future,
          }),
      );
  }

  static createVAResponses({ localStartTime, future = false, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            localStartTime,
            future,
          }),
      );
  }

  static createCCResponse({ serviceType }) {
    return new MockAppointmentResponse({
      kind: 'cc',
      modality: 'communityCare',
      status: APPOINTMENT_STATUS.proposed,
      serviceType,
    });
  }

  setPatientComments(value) {
    this.attributes.patientComments = value;
    return this;
  }

  setCancelationReason(value) {
    this.attributes.cancelationReason = {
      coding: [{ code: value }],
    };

    return this;
  }

  setClinicId(id) {
    this.attributes.clinic = id;
    return this;
  }

  setPhysicalLocation(room) {
    this.attributes.physicalLocation = room;
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

  setLocation(location) {
    this.attributes.location = location;
    return this;
  }

  setPreferredDates(values) {
    this.attributes.preferredDates = values;
    return this;
  }

  setTypeOfCare(value) {
    this.attributes.serviceType = value;
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

  setLocationId(value) {
    this.attributes.locationId = value.toString();
    return this;
  }

  setModality(value) {
    this.attributes.modality = value;
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

  setRequestedPeriods(requestedPeriods) {
    this.attributes.localStartTime = undefined;
    this.attributes.requestedPeriods = requestedPeriods.map(date => {
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

  setPreferredModlity(value) {
    this.attributes.preferredModality = value;
    return this;
  }

  setUrl(value = 'test.com') {
    this.attributes.telehealth = {
      ...this.attributes.telehealth,
      url: value,
    };

    return this;
  }
}
