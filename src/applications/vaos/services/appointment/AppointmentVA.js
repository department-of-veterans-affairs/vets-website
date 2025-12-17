import Appointment from './Appointment';

export default class AppointmentVA extends Appointment {
  constructor(response) {
    super(response);

    this.isInPersonVisit = true;
    this._modality = 'vaInPerson';

    if (this.isPendingAppointment) this._modalityText = 'In person';
    else {
      this._modalityText = response.location?.name
        ? `At ${response.location.name}`
        : 'At VA facility';
    }
  }
}
