import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import DetailsVideo from '../DetailsVideo';
import {
  AtlasAppoinment,
  Facility,
} from '../../../../tests/mocks/unit-test-helpers';

const appointmentData = {
  start: '2024-07-19T12:00:00Z',
  comment: 'Medication Review',
  vaos: {
    isPastAppointment: true,
  },
  location: {
    vistaId: '983',
    clinicId: '848',
    stationId: '983',
    clinicName: 'CHY PC VAR2',
  },
};
const facilityData = new Facility();

describe('VAOS Component: DetailsVideo', () => {
  const initialState = {
    featureToggles: {},
  };
  it('should return Back to past appointments descriptive back link and past status alart', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isVideo: true,
        isAtlas: false,
        extension: { patientHasMobileGfe: true },
        kind: 'MOBILE_ANY',
      },
      vaos: {
        isPastAppointment: true,
      },
    };
    const props = { appointment, facilityData };
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
    const atlasAppointment = new AtlasAppoinment();
    const appointment = {
      ...appointmentData,
      ...atlasAppointment,
      vaos: {
        isUpcomingAppointment: true,
      },
    };
    const props = { appointment, facilityData };
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
    const appointment = {
      ...appointmentData,
      videoData: {
        isVideo: true,
        isAtlas: false,
        extension: { patientHasMobileGfe: true },
        kind: 'MOBILE_ANY',
      },
    };
    const props = { appointment, facilityData };
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
    const appointment = {
      ...appointmentData,
      videoData: {
        isVideo: true,
        isAtlas: false,
        extension: { patientHasMobileGfe: true },
        kind: 'ADHOC',
      },
    };
    const props = { appointment, facilityData };
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
    const appointment = {
      ...appointmentData,
      videoData: {
        isVideo: true,
        isAtlas: false,
        extension: { patientHasMobileGfe: false },
        kind: 'MOBILE_ANY',
      },
    };
    const props = { appointment, facilityData };
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
    const appointment = {
      ...appointmentData,
      videoData: {
        isVideo: true,
        isAtlas: false,
        extension: { patientHasMobileGfe: false },
        kind: 'ADHOC',
      },
    };
    const props = { appointment, facilityData };
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
    const appointment = {
      ...appointmentData,
      videoData: {
        isVideo: true,
        extension: { patientHasMobileGfe: true },
        kind: 'CLINIC_BASED',
      },
    };
    const props = { appointment, facilityData };
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
    const atlasAppointment = new AtlasAppoinment();
    const appointment = {
      ...appointmentData,
      ...atlasAppointment,
    };
    const props = { appointment, facilityData };
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
    const appointment = {
      ...appointmentData,
      videoData: {
        isVideo: true,
        isAtlas: false,
        extension: { patientHasMobileGfe: false },
        kind: null,
      },
    };
    const props = { appointment, facilityData };
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
