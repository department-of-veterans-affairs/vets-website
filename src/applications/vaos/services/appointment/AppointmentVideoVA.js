import { formatFacilityAddress, getFacilityPhone } from '../location';
import AppointmentVideo from './AppointmentVideo';

export default class AppointmentVideoVA extends AppointmentVideo {
  constructor(response) {
    super(response);
    this.modality = 'vaVideoCareAtAVaLocation';
    this._modalityText = this.facilityName
      ? `At ${this.facilityName}`
      : 'At VA facility';
  }

  get getCalendarData() {
    const providerText = this.location?.name
      ? `You'll be meeting with ${this.location?.name}`
      : '';

    const data = {
      summary: `VA Video Connect appointment at ${this.location?.name ||
        'a VA location'}`,
      providerName: this.location?.name,
      location: formatFacilityAddress(this.location),
      text: `You need to join this video meeting from${
        this.location
          ? ':'
          : ' the VA location where you scheduled the appointment.'
      }`,
      phone: getFacilityPhone(this.location),
    };

    if (this.location?.name)
      data.additionalText = [providerText, this.signinText];
    else data.additionalText = [this.signinText];

    return data;
  }
}
