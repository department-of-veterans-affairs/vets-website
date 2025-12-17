import { formatInTimeZone } from 'date-fns-tz';
import { getProviderName } from '../../utils/appointment';
import Appointment from './Appointment';
import { getTimezoneNameFromAbbr } from '../../utils/timezone';
import { selectTimeZoneAbbr } from '../../appointment-list/redux/selectors';
import { formatFacilityAddress, getFacilityPhone } from '../location';

export default class AppointmentCC extends Appointment {
  constructor(response) {
    super(response);

    this.isCommunityCare = response.kind === 'cc';
    this.modality = 'communityCare';
    this._modalityText = this.isPendingAppointment ? 'Community care' : null;

    this.practiceName = response.extension?.ccLocation?.practiceName;
    this.treatmentSpecialty = response.extension?.ccTreatingSpecialty;
    this.address = response.extension?.ccLocation?.address;
    this.telecom = response.extension?.ccLocation?.telecom;
    this.providers = (response.practitioners || []).map(practitioner => ({
      name: {
        firstName: practitioner.name?.given.join(' '),
        lastName: practitioner.name?.family,
      },
      providerName: practitioner.name
        ? `${practitioner.name.given.join(' ')} ${practitioner.name.family}`
        : null,
    }));
    // TODO: Needs work!!!!
    this.providerName =
      this.providers !== undefined ? getProviderName(response) : null;
  }

  get appointmentDetailAriaText() {
    const appointmentDate = this.startDate;
    const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(this));
    const fillin1 = this.isCanceled ? `Details for canceled` : 'Details for';
    const fillin2 =
      this.typeOfCareName && typeof this.typeOfCareName !== 'undefined'
        ? `${this.typeOfCareName} appointment`
        : 'appointment';
    const fillin3 = `${formatInTimeZone(
      appointmentDate,
      this.timezone,
      'EEEE, MMMM d h:mm aaaa',
    )}, ${timezoneName}`;

    return `${fillin1} community care ${fillin2} ${fillin3}`;
  }

  get getCalendarData() {
    // let { practiceName } = this.communityCareProvider || {};
    const providerName = getProviderName(this);
    let summary = 'Community care this';
    const practiceName = this.practiceName?.trim().length
      ? this.practiceName
      : '';
    if (!!practiceName || !!providerName) {
      // order of the name appearing on the calendar title is important to match the display screen name
      summary =
        this.version === 1
          ? `Appointment at ${providerName || practiceName}`
          : `Appointment at ${(providerName || [])[0] || practiceName}`;
    }

    return {
      summary,
      providerName:
        providerName !== undefined ? `${providerName || practiceName}` : null,
      location: formatFacilityAddress(this.communityCareProvider),
      text:
        'You have a health care appointment with a community care provider. Please don’t go to your local VA health facility.',
      phone: getFacilityPhone(this.communityCareProvider),
      additionalText: [this.signinText],
    };
  }
}
