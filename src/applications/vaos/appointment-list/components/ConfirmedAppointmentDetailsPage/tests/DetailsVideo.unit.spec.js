import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';
import DetailsVideo from '../DetailsVideo';

const appointment = {
  start: '2024-07-19T12:00:00Z',
  comment: 'Medication Review',
  vaos: {
    isVideo: true,
    appointmentType: 'vaAppointment',
  },
  location: {
    vistaId: '983',
    clinicId: '848',
    stationId: '983',
    clinicName: 'CHY PC VAR2',
  },
};
const facilityData = {
  resourceType: 'Location',
  id: '983',
  vistaId: '983',
  name: 'Cheyenne VA Medical Center',
  telecom: [
    {
      system: 'phone',
      value: '509-434-7000',
    },
  ],
};
const props = { appointment, facilityData };
describe('DetailsVideo component with descriptive back link', () => {
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.vaOnlineSchedulingDescriptiveBackLink]: true,
    },
  };
  it('should return Back to past appointments descriptive back link and past status alart', async () => {
    appointment.videoData = {
      isVideo: true,
      isAtlas: false,
      extension: { patientHasMobileGfe: true },
      kind: 'MOBILE_ANY',
    };
    appointment.vaos = {
      isPastAppointment: true,
    };
    const wrapper = renderWithStoreAndRouter(<DetailsVideo {...props} />, {
      initialState,
    });
    expect(
      wrapper.getByText('Back to past appointments', {
        exact: true,
        selector: 'a',
      }),
    ).to.exist;

    // Check for StatusAlert component.
    expect(await wrapper.findByText('This appointment occurred in the past.'))
      .to.exist;
  });
  it('should return appointment time, provider, insturctions, print link, calendar link, video Location and cancel message', async () => {
    appointment.videoData = {
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
    };
    appointment.vaos = {
      isUpcomingAppointment: true,
    };
    const wrapper = renderWithStoreAndRouter(<DetailsVideo {...props} />, {
      initialState,
    });

    // Check for AppointmentDateTime component.
    expect(await wrapper.findByText('Friday, July 19, 2024 at 12:00 p.m.')).to
      .exist;

    // Check for VideoLocation component.
    expect(
      await wrapper.findByText(
        'You must join this video meeting from the ATLAS (non-VA) location listed below.',
      ),
    ).to.exist;

    // Check for VideoInstructionsLink component.
    expect(await wrapper.findByText('Medication review')).to.exist;

    // Check for VideoVisitProvider component.
    expect(await wrapper.findByText('TEST PROV')).to.exist;

    // Check for CalendarLink component.
    const addToCalendarLink = wrapper.getByTestId('add-to-calendar-link');
    expect(addToCalendarLink.getAttribute('text')).to.contain(
      'Add to calendar',
    );

    // Check for PrintLink component.
    expect(await wrapper.findByText('Print')).to.exist;

    // Check for NoOnlineCancelAlert component.
    expect(await wrapper.findByText('Need to make changes?')).to.exist;
  });
  it('should return header as VA Video Connect using VA device with MOBILE_ANY kind', () => {
    appointment.videoData = {
      isVideo: true,
      isAtlas: false,
      extension: { patientHasMobileGfe: true },
      kind: 'MOBILE_ANY',
    };
    const wrapper = renderWithStoreAndRouter(<DetailsVideo {...props} />, {
      initialState,
    });
    expect(
      wrapper.getByText('VA Video Connect using VA device', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
  });
  it('should return header as VA Video Connect using VA device wiith ADHOC kind', () => {
    appointment.videoData = {
      isVideo: true,
      isAtlas: false,
      extension: { patientHasMobileGfe: true },
      kind: 'ADHOC',
    };
    const wrapper = renderWithStoreAndRouter(<DetailsVideo {...props} />, {
      initialState,
    });
    expect(
      wrapper.getByText('VA Video Connect using VA device', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
  });
  it('should return header as VA Video Connect at home with MOBILE_ANY kind', () => {
    appointment.videoData = {
      isVideo: true,
      isAtlas: false,
      extension: { patientHasMobileGfe: false },
      kind: 'MOBILE_ANY',
    };
    const wrapper = renderWithStoreAndRouter(<DetailsVideo {...props} />, {
      initialState,
    });
    expect(
      wrapper.getByText('VA Video Connect at home', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
  });
  it('should return header as VA Video Connect at home with ADHOC kind', () => {
    appointment.videoData = {
      isVideo: true,
      isAtlas: false,
      extension: { patientHasMobileGfe: false },
      kind: 'ADHOC',
    };
    const wrapper = renderWithStoreAndRouter(<DetailsVideo {...props} />, {
      initialState,
    });
    expect(
      wrapper.getByText('VA Video Connect at home', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
  });
  it('should return header as VA Video Connect at VA location', () => {
    appointment.videoData = {
      isVideo: true,
      isAtlas: false,
      extension: { patientHasMobileGfe: false },
      kind: 'CLINIC_BASED',
    };
    const wrapper = renderWithStoreAndRouter(<DetailsVideo {...props} />, {
      initialState,
    });
    expect(
      wrapper.getByText('VA Video Connect at VA location', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
  });
  it('should return header as VA Video Connect at an ATLAS location', () => {
    appointment.videoData = {
      isVideo: true,
      isAtlas: true,
      url: null,
      duration: 30,
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
    };
    const wrapper = renderWithStoreAndRouter(<DetailsVideo {...props} />, {
      initialState,
    });
    expect(
      wrapper.getByText('VA Video Connect at an ATLAS location', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
  });
  it('should return header as empty string', () => {
    appointment.videoData = {
      isVideo: true,
      isAtlas: false,
      extension: { patientHasMobileGfe: false },
      kind: null,
    };
    const wrapper = renderWithStoreAndRouter(<DetailsVideo {...props} />, {
      initialState,
    });
    expect(
      wrapper.getByText('', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
  });
});
describe('DetailsVideo component with Breadcrumb component', () => {
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.vaOnlineSchedulingDescriptiveBackLink]: false,
    },
  };
  it('should return breadcrumb component', () => {
    appointment.videoData = {
      isVideo: true,
      isAtlas: false,
      extension: { patientHasMobileGfe: true },
      kind: 'MOBILE_ANY',
    };
    const wrapper = renderWithStoreAndRouter(<DetailsVideo {...props} />, {
      initialState,
    });
    expect(wrapper.queryByLabelText('Breadcrumbs')).to.exist;
  });
});
