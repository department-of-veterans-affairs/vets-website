import Appointment from './Appointment';

export default class AppointmentVaccine extends Appointment {
  constructor(response) {
    super(response);

    this.isCOVIDVaccine = response.modality === 'vaInPersonVaccine';
  }
}
