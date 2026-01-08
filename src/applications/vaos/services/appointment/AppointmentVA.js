import Appointment from './Appointment';

export default class AppointmentVA extends Appointment {
  constructor(response) {
    super(response);

    this.isInPersonVisit = true;
    // this.modality = 'vaInPerson';

    if (this.isPendingAppointment) this.modalityText = 'In person';
    else {
      this.modalityText = response.location?.name
        ? `At ${response.location.name}`
        : 'At VA facility';
    }
  }

  get appointmentLocality() {
    if (this.isPendingAppointment) return 'TODO: return facility name';

    if (this.typeOfCareName && this.practitionerName) {
      return `${this.typeOfCareName} with ${this.practitionerName}`;
    }

    if (this.practitionerName)
      return `
          VA appointment with ${this.practitionerName}`;

    if (this.typeOfCareName) {
      return this.typeOfCareName;
    }

    // Default
    return 'VA Appointment';
  }
}
