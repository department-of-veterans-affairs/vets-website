import moment from 'moment';
import { APPOINTMENT_STATUS, TYPE_OF_VISIT_ID } from '../../../utils/constants';

/**
 * @typedef {import('moment-timezone').Moment} Moment
 */

/**
 * Mock appointment class.
 *
 * @export
 * @class MockAppointment
 */
export class MockAppointment {
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
      extension: {
        patientHasMobileGfe,
      },
      kind,
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
}
