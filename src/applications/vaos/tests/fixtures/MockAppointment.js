import { format } from 'date-fns';

/**
 * Mock Appointment class.
 *
 * @export
 * @class MockAppointment
 */

export class MockAppointment {
  /**
   * Creates an instance of MockAppointment.
   * NOTE: This instance respresents an appointment after it has been transformed.
   *
   * @param {Object} props - Properties used to determine what type of mock appointment to create.
   * @param {string|number} [props.id=1] - Set appointment id. Default = 1.
   * @param {Date} props.start - Set appointment start time. Default = Current date.
   * @param {string} props.status - Appointment status.
   * @memberof MockAppointment
   */
  constructor({ id = 1, start = new Date(), status = 'booked' } = {}) {
    this.avsPath = null;
    this.cancelationReason = null;
    this.showScheduleLink = null;
    this.comment = null;
    this.communityCareProvider = null;
    this.description = null;
    this.id = id.toString();
    this.location = {};
    this.minutesDuration = 60;
    this.patientComments = 'This is a test:Additional information';
    this.practitioners = [];
    this.preferredProviderName = null;
    this.resourceType = 'MockAppointment';
    this.type = 'VA';

    this.start = format(start, "yyyy-MM-dd'T'HH:mm:ss");

    this.status = status;
    this.vaos = {
      apiData: null,
      isPastAppointment: false,
      isUpcomingAppointment: false,
      isPendingAppointment: false,
      isCompAndPenAppointment: false,
      isInPersonVisit: false,
    };
    this.version = 2;
    this.videoData = {};
  }

  // ADD 'setters' as needed
  setApiData(value) {
    this.vaos.apiData = value.attributes;
    return this;
  }

  setComment(value) {
    this.comment = value;
    return this;
  }

  /**
   * Set community care provider attribtue.
   *
   * @param {MockCommunityCareProvider} value
   * @returns Instance of this object.
   * @memberof MockAppointment
   */
  setCommunityCareProvider(value) {
    this.communityCareProvider = value;
    return this;
  }

  setKind(value) {
    this.videoData.kind = value;
    return this;
  }

  /**
   *
   *
   * @param {MockFacility} value
   * @returns Instance of this object.
   * @memberof MockAppointment
   */
  setLocation(value) {
    this.location = value;
    return this;
  }

  setStatus(value) {
    this.status = value;
    return this;
  }

  setIsInPersonVisit(value) {
    this.vaos.isInPersonVisit = value;
    return this;
  }

  setIsPastAppointment(value) {
    this.vaos.isPastAppointment = value;
    return this;
  }

  setIsUpcomingAppointment(value) {
    this.vaos.isUpcomingAppointment = value;
    return this;
  }

  setIsPendingAppointment(value) {
    this.vaos.isPendingAppointment = value;
    return this;
  }

  setIsCompAndPenAppointment(value) {
    this.vaos.isCompAndPenAppointment = value;
    return this;
  }

  setAvsPath(value) {
    this.avsPath = value;
    return this;
  }

  setCancelationReason(value) {
    this.cancelationReason = value;
    return this;
  }

  setShowScheduleLink(value) {
    this.showScheduleLink = value;
    return this;
  }

  setCreated(value) {
    this.created = value;
    return this;
  }

  setModality(value) {
    this.modality = value;
    return this;
  }

  setPatientComments(value) {
    this.patientComments = value;
    return this;
  }

  setType(value) {
    this.type = value;
    return this;
  }

  setVideoData(value) {
    this.videoData = value;
    return this;
  }
}
