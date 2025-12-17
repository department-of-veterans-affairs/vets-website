import Appointment from './Appointment';

export default class AppointmentVARequest extends Appointment {
  constructor(response) {
    super(response);
    this.modality = 'vaInPerson';
  }
}
