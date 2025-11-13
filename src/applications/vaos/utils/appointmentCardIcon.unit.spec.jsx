import { expect } from 'chai';
import { appointmentIcon } from './appointmentCardIcon';

const appointmentData = {
  start: '2024-07-19T08:00:00-07:00',
  version: 2,
  status: 'booked',
  vaos: {
    isCanceled: false,
    isUpcomingAppointment: true,
    isPastAppointment: false,
    isCommunityCare: false,
    isPhoneAppointment: false,
    isCompAndPenAppointment: false,
    isVideo: false,
    isCOVIDVaccine: false,
    apiData: {},
  },
};

describe('VAOS Util: appointmentCard', () => {
  it('should display location_city icon for VA in-person appointments', () => {
    const appointment = {
      ...appointmentData,
      kind: 'clinic',
      type: 'VA',
      modality: 'vaInPerson',
      vaos: {
        isInPersonVisit: true,
      },
    };
    const icon = appointmentIcon(appointment);
    expect(icon).to.equal('location_city');
  });

  it('should display location_city icon for VA in-person vaccine appointments', () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isCOVIDVaccine: true,
      },
    };
    const icon = appointmentIcon(appointment);
    expect(icon).to.equal('location_city');
  });

  it('should display location_city icon for VA video care at a VA location appointments', () => {
    const clinicAppointment = {
      ...appointmentData,
      vaos: {
        isVideo: true,
        isAtlas: false,
        isVideoAtVA: true,
      },
      videoData: {
        kind: 'CLINIC_BASED',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };
    const storeAppointment = {
      ...appointmentData,
      vaos: {
        isVideo: true,
        isAtlas: false,
        // When running old test by it self, it failed with calendar_today.
        isVideoAtVA: true,
      },
      videoData: {
        kind: 'STORE_FORWARD',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const clinicIcon = appointmentIcon(clinicAppointment);
    expect(clinicIcon).to.equal('location_city');
    const storeIcon = appointmentIcon(storeAppointment);
    expect(storeIcon).to.equal('location_city');
  });

  it('should display location_city icon for claim exam appointment', () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isCompAndPenAppointment: true,
      },
    };
    const icon = appointmentIcon(appointment);
    expect(icon).to.equal('location_city');
  });

  it('should display location_city icon for VA video care at ATLAS location appointments', () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: true,
        isAtlas: true,
      },
    };
    const icon = appointmentIcon(appointment);
    expect(icon).to.equal('location_city');
  });

  it('should display calendar_today icon for community care appointment appointments', () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isCommunityCare: true,
      },
    };
    const icon = appointmentIcon(appointment);
    expect(icon).to.equal('calendar_today');
  });

  it('should display videocam icon for VA video care at a home appointments', () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: true,
        isVideoAtHome: true,
        isAtlas: false,
      },
      videoData: {
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };
    const appointment2 = {
      ...appointmentData,
      vaos: {
        isVideo: true,
        isVideoAtHome: true,
        isAtlas: false,
      },
      videoData: {
        kind: 'ADHOC',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };
    const icon = appointmentIcon(appointment);
    expect(icon).to.equal('videocam');

    const icon2 = appointmentIcon(appointment2);
    expect(icon2).to.equal('videocam');
  });

  it('should display phone icon for VA phone appointments', () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isPhoneAppointment: true,
      },
    };
    const icon = appointmentIcon(appointment);
    expect(icon).to.equal('phone');
  });
});
