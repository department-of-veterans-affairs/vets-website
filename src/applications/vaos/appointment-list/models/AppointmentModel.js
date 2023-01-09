import moment from 'moment-timezone';
import { getAppointmentTimezone } from '../../services/appointment';
import { getTypeOfCareById } from '../../utils/appointment';
import { APPOINTMENT_STATUS, APPOINTMENT_TYPES } from '../../utils/constants';

export class AppointmentModel {
  constructor(data) {
    this.data = data;
  }

  isCommunityCare() {
    return this.data.vaos.isCommunityCare;
  }

  isVideo() {
    return this.data.vaos.isVideo;
  }

  isAtlas() {
    return !!this.data.telehealth?.atlas;
  }

  isPast() {
    return this.data.vaos.isPastAppointment;
  }

  isPhone() {
    return this.data.vaos.isPhoneAppointment;
  }

  isInPerson() {
    return !this.isVideo() && !this.isCommunityCare() && !this.isPhone();
  }

  isCanceled() {
    return this.data.status === APPOINTMENT_STATUS.cancelled;
  }

  isUpcoming() {
    return (
      this.data.status === APPOINTMENT_STATUS.booked ||
      this.data.status === APPOINTMENT_STATUS.cancelled
    );
  }

  getId() {
    return this.data.id;
  }

  getStartDate() {
    return moment(this.data.start);
  }

  getEndDate() {
    return moment(this.data.end);
  }

  getStatus() {
    return this.data.getStatus;
  }

  getLocationId() {
    return this.data.locationId;
  }

  getVistaId() {
    return this.data.locationId?.substr(0, 3) || null;
  }

  getClinicId() {
    return this.data.clinic;
  }

  getStationId() {
    return this.data.locationId;
  }

  getClinicName() {
    return this.data.serviceName || null;
  }

  getAppointmentType() {
    let type = APPOINTMENT_TYPES.vaAppointment;

    if (this.data.kind === 'cc' && this.data.start) {
      type = APPOINTMENT_TYPES.ccAppointment;
    } else if (this.data.kind === 'cc' && this.data.requestedPeriods?.length) {
      type = APPOINTMENT_TYPES.ccRequest;
    } else if (this.data.kind !== 'cc' && this.data.requestedPeriods?.length) {
      type = APPOINTMENT_TYPES.request;
    }

    return type;
  }

  getDetailLink() {
    return this.getAppointmentType() === 'cc'
      ? `cc/${this.getId()}`
      : `va/${this.getId()}`;
  }

  getModality() {
    let modaility = 'person';

    if (this.isPhone()) modaility = 'Phone call';
    if (this.isCommunityCare()) modaility = 'Community care';
    if (this.isVideo()) modaility = 'Video appointment';
    if (this.isInPerson()) modaility = 'In person';

    return modaility;
  }

  getModalityIcon() {
    let icon = 'fa-building';

    if (this.isPhone()) icon = 'fa-phone-alt';
    if (this.isVideo()) icon = 'fa-video';
    if (this.isInPerson() || this.isCommunityCare()) icon = 'fa-building';

    return icon;
  }

  getPractitionerName() {
    const { practitioners } = this.data;

    if (!practitioners?.length) return null;

    const practitioner = practitioners[0];
    const { name } = practitioner;

    return `${name?.given.toString().replaceAll(',', ' ')} ${name?.family}`;
  }

  getTimeZoneAbbr() {
    const { abbreviation } = this.getAppointmentTimezone();
    return abbreviation;
  }

  getAppointmentTimezone() {
    return getAppointmentTimezone(this.data);
  }

  getAppointmentDetails() {
    const practitioner = this.getPractitionerName();
    const typeOfCareName = this.getTypeOfCareName();

    if (this.isCommunityCare()) return 'Community care';
    if (this.isPhone()) return 'VA Appointment';
    if (this.isVideo())
      return practitioner
        ? `VA Appointment with ${practitioner}`
        : 'VA Appointment';
    if (this.isInPerson())
      return typeOfCareName && practitioner
        ? `${typeOfCareName} with ${practitioner}`
        : 'VA Appointment';

    return '';
  }

  getTypeOfCareName() {
    const { name } = getTypeOfCareById(this.data.vaos.apiData.serviceType);
    return name;
  }

  toString() {
    return `Appointment: ${this.getId()}`;
  }
}
