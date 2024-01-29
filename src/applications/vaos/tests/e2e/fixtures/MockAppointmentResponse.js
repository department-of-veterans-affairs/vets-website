import moment from 'moment';
import {
  APPOINTMENT_STATUS,
  TYPE_OF_VISIT_ID,
  VIDEO_TYPES,
} from '../../../utils/constants';

/**
 * @typedef {import('moment-timezone').Moment} Moment
 */

/**
 * Mock appointment class.
 *
 * @export
 * @class MockAppointment
 */
export default class MockAppointmentResponse {
  /**
   * Creates an instance of MockAppointment.
   * @param {Object} props - Properties used to determine what type of mock appointment to create.
   * @param {Object=} props.atlas - Set this to create an atlas appointment.
   * @param {Moment} props.localStartTime - Set appointment start time.
   * @param {string=} props.url - Set video appointment URL.
   * @param {string=} props.vvsKind - Set type of video appointment.
   * @param {string|number} [props.id=1] - Set appointment id.
   * @param {boolean} [props.cancellable=true] - Set if appointment is cancellable.
   * @param {string|TYPE_OF_VISIT_ID} [props.kind=clinic] - Set if appointment is VA or CC appointment.
   * @param {boolean} [props.patientHasMobileGfe=false] - Set if patient has mobile device for video appointments.
   * @param {string} [props.serviceType=primaryCare] - Set appointment type of care.
   * @param {string} [props.status=booked] - Set appointment status. If appointment status is 'APPOINTMENT_STATUS.proposed', localStart time is used for requested periods.
   * @memberof MockAppointment
   */
  constructor({
    atlas,
    localStartTime,
    url,
    vvsKind,
    id = '1',
    cancellable = true,
    kind = TYPE_OF_VISIT_ID.clinic,
    patientHasMobileGfe = false,
    serviceType = 'primaryCare',
    status = 'booked',
  } = {}) {
    const requestedPeriods = [];
    let timestamp = moment();

    if (localStartTime && localStartTime instanceof moment)
      timestamp = localStartTime;

    if (status === APPOINTMENT_STATUS.proposed) {
      requestedPeriods.push({
        start: timestamp.format('YYYY-MM-DDTHH:mm:ss.000Z'),
        end: timestamp.format('YYYY-MM-DDTHH:mm:ss.000Z'),
      });
    }

    this.id = id.toString();
    this.type = 'MockAppointment';
    this.attributes = {
      id,
      cancellable,
      clinic: '1',
      extension: {
        patientHasMobileGfe,
      },
      kind,
      locationId: '983',
      localStartTime: timestamp.format('YYYY-MM-DDTHH:mm:ss.000Z'),
      requestedPeriods:
        requestedPeriods.length > 0 ? requestedPeriods : undefined,
      serviceType,
      status,
      telehealth: {
        atlas,
        url,
        vvsKind,
      },
    };
  }

  static createAtlasResponses({ localStartTime, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
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
          }),
      );
  }

  static createCCResponses({ localStartTime, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: 'cc',
            localStartTime,
          }),
      );
  }

  static createClinicResponses({ localStartTime, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            localStartTime,
            vvsKind: VIDEO_TYPES.clinic,
          }),
      );
  }

  static createGfeResponses({ localStartTime, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            localStartTime,
            vvsKind: VIDEO_TYPES.mobile,
            patientHasMobileGfe: true,
          }),
      );
  }

  static createMobileResponses({ localStartTime, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            localStartTime,
            vvsKind: VIDEO_TYPES.mobile,
          }),
      );
  }

  static createPhoneResponses({ localStartTime, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.phone,
            localStartTime,
          }),
      );
  }

  static createStoreForwardResponses({ localStartTime, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            localStartTime,
            vvsKind: VIDEO_TYPES.storeForward,
          }),
      );
  }

  static createVAResponses({ localStartTime, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            localStartTime,
          }),
      );
  }

  setId(value) {
    this.id = value.toString();
    return this;
  }

  setLocation(location) {
    this.attributes.location = location;
  }

  setTypeOfCare(value) {
    this.attributes.serviceType = value;
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
  }
}
