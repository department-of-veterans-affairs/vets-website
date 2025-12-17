import AppointmentVA from './AppointmentVA';

export default class AppointmentClaimExam extends AppointmentVA {
  constructor(response) {
    super(response);

    this.isCompAndPenAppointment = true;
    this.modality = 'claimExamAppointment';
  }
}
