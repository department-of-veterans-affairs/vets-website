import Appointment from './Appointment';

export default class AppointmentVARequest extends Appointment {
  constructor(response) {
    super(response);
    this.preferredDates = response.preferredDates || [];

    // this.modality = 'vaInPerson';
  }
}
