import AppointmentVideo from './AppointmentVideo';

export default class AppointmentVideoHome extends AppointmentVideo {
  constructor(response) {
    super(response);

    // this.modality = 'vaVideoCareAtHome';
    this._modalityIcon = 'videocam';
    this.modalityText = 'Video';
  }

  get getCalendarData() {
    return {
      summary: 'VA Video Connect appointment',
      text: 'You can join this meeting up to 30 minutes before the start time.',
      location: 'VA Video Connect at home',
      additionalText: [this.signinText],
    };
  }
}
