import { formatInTimeZone } from 'date-fns-tz';
import Appointment from './Appointment';
import { getTimezoneNameFromAbbr } from '../../utils/timezone';
import { selectTimeZoneAbbr } from '../../appointment-list/redux/selectors';
import { formatFacilityAddress, getFacilityPhone } from '../location';

export default class AppointmentPhone extends Appointment {
  constructor(response) {
    super(response);

    this.isVAPhoneAppointment = true;
    this.modality = 'vaPhone';
    this._modalityIcon = 'phone';
    this._modalityText = 'Phone';
  }

  get appointmentDetailAriaText() {
    const appointmentDate = this.startDate;
    const fillin1 = this.isCanceled ? `Details for canceled` : 'Details for';
    const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(this));
    // const timezoneName = getTimezoneNameFromAbbr(
    //   selectTimeZoneAbbr(appointment),
    // );
    // const timezoneName = 'America/Chicago';

    const fillin2 =
      this.typeOfCareName && typeof this.typeOfCareName !== 'undefined'
        ? `${this.typeOfCareName} appointment`
        : 'appointment';
    const fillin3 = `${formatInTimeZone(
      appointmentDate,
      this.timezone,
      'EEEE, MMMM d h:mm aaaa',
    )}, ${timezoneName}`;

    return `${fillin1} phone ${fillin2} ${fillin3}`;
  }

  get getCalendarData() {
    return {
      summary: 'Phone appointment',
      providerName: this.location?.name,
      location: formatFacilityAddress(this.location),
      text: `A provider will call you at ${formatInTimeZone(
        this.start,
        this.timezone,
        'h:mm aaaa',
      )}`,
      phone: getFacilityPhone(this.location),
      additionalText: [this.signinText],
    };
  }
}
