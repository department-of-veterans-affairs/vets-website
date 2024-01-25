/**
 * Mocks Atlas Appoinment.
 *
 * @export
 * @returns {AtlasAppoinment} VAOS Atlas Appoinment object
 */
export function AtlasAppoinment() {
  return {
    videoData: {
      providers: [
        {
          name: {
            firstName: ['TEST'],
            lastName: 'PROV',
          },
          display: 'TEST PROV',
        },
      ],
      isVideo: true,
      isAtlas: true,
      atlasConfirmationCode: '7VBBCA',
      atlasLocation: {
        id: '9931',
        resourceType: 'Location',
        address: {
          line: ['114 Dewey Ave'],
          city: 'Eureka',
          state: 'MT',
          postalCode: '59917',
        },
        position: {
          longitude: -115.1,
          latitude: 48.8,
        },
      },
      extension: { patientHasMobileGfe: true },
      kind: 'ADHOC',
    },
  };
}
/**
 * Mocks Facility object.
 *
 * @export
 * @returns {Facility} VAOS Facility object
 */
export function Facility(facilityId) {
  const id = facilityId || '983';
  return {
    resourceType: 'Location',
    id,
    vistaId: id,
    name: 'Cheyenne VA Medical Center',
    telecom: [
      {
        system: 'phone',
        value: '509-434-7000',
      },
    ],
    address: {
      postalCode: '82001-5356',
      city: 'Cheyenne',
      state: 'WY',
      line: ['2360 East Pershing Boulevard'],
    },
  };
}

/**
 * @typedef {import('moment-timezone').Moment} Moment
 */

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
   * @param {string|number} [props.id=1] - Set appointment id
   * @param {Moment} props.start - Set appointment start time.
   * @memberof MockAppointment
   */
  constructor({ id = 1, start } = {}) {
    this.avsPath = '';
    this.cancelationReason = '';
    this.comment = '';
    this.communityCareProvider = null;
    this.description = '';
    this.id = id.toString();
    this.location = {};
    this.minutesDuration = '';
    this.practitioners = [];
    this.preferredProviderName = '';
    this.resourceType = '';

    if (start && start.isValid())
      this.start = start.format('YYYY-MM-DDTHH:mm:ss');
    else throw new Error('Appointment start required');

    this.status = '';
    this.vaos = {
      isPastAppointment: false,
      isUpcomingAppointment: false,
    };
    this.version = 2;
    this.videoData = {
      kind: '',
      isVideo: false,
    };
  }

  // ADD 'setters' as needed

  setComment(value) {
    this.comment = value;
  }

  setKind(value) {
    this.videoData.kind = value;
  }

  setStatus(value) {
    this.status = value;
  }

  setIsPastAppointment(value) {
    this.vaos.isPastAppointment = value;
  }

  setIsUpcomingAppointment(value) {
    this.vaos.isUpcomingAppointment = value;
  }

  setAvsPath(value) {
    this.avsPath = value;
  }

  setCancelationReason(value) {
    this.cancelationReason = value;
  }
}
