import Appointment from './Appointment';

export default class AppointmentCCRequest extends Appointment {
  constructor(response) {
    super(response);

    this.preferredDates = response.preferredDates || [];
    // this.modality = 'communityCare';
  }
}
