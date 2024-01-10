import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';

import sinon from 'sinon';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import AppointmentCard from '../AppointmentCard';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';

const appointmentData = {
  start: '2024-07-19T12:00:00Z',
  comment: 'Medication Review',
  id: '1234',
  vaos: {
    isVideo: true,
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
describe('AppointmentCard component', () => {
  const initialState = {
    featureToggles: {
      featureStatusImprovement: true,
    },
  };

  it('should return at an ATLAS location as VideoAppointmentDescription', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isAtlas: true,
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/VA Video Connect at an ATLAS location/i))
      .to.exist;
  });

  it('should return at a VA location as VideoAppointmentDescription', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isAtlas: false,
        kind: 'CLINIC_BASED',
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/VA Video Connect at a VA location/i)).to
      .exist;
  });
  it('should return using a VA device as VideoAppointmentDescription', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: true,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/VA Video Connect using a VA device/i)).to
      .exist;
  });
  it('should return using a VA device as VideoAppointmentDescription if kind is ADHOC', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isAtlas: false,
        kind: 'ADHOC',
        extension: {
          patientHasMobileGfe: true,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/VA Video Connect using a VA device/i)).to
      .exist;
  });
  it('should return at home as VideoAppointmentDescription', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/VA Video Connect at home/i)).to.exist;
  });
  it('should return at home as VideoAppointmentDescription if kind is ADHOC', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isAtlas: false,
        kind: 'ADHOC',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/VA Video Connect at home/i)).to.exist;
  });

  it('should return correct Provider Name', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: true,
      },
      communityCareProvider: {
        providerName: ['MICHAEL BERMEL'],
      },
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/MICHAEL BERMEL/i)).to.exist;
  });
  it('should return correct Provider Name if practice name and name fields are null', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: true,
      },
      communityCareProvider: {
        providerName: ['MICHAEL BERMEL'],
      },
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/MICHAEL BERMEL/i)).to.exist;
  });

  it('should return practiceName', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: true,
      },
      communityCareProvider: {
        practiceName: 'Test Practice',
        providerName: [],
      },
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );
    expect(await wrapper.findAllByText(/Test Practice/i)).to.exist;
  });
  it('should return community Care as provider name', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: true,
      },
      communityCareProvider: {
        practiceName: '',
        providerName: [],
        name: 'Test Practice',
      },
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findAllByText(/Community Care/i)).to.exist;
  });
  it('should return community Care as provider name if no provider name is available', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: true,
      },
      communityCareProvider: {
        practiceName: null,
        providerName: null,
        name: null,
      },
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findAllByText(/Community Care/i)).to.exist;
  });
  it('should return facility name', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: false,
      },
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );
    expect(await wrapper.findAllByText(/Cheyenne VA Medical Center/i)).to.exist;
  });
  it('should return facility name as VA appointment', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: false,
      },
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };
    const facility = null;

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facility}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );
    expect(await wrapper.findAllByText(/VA appointment/i)).to.exist;
  });
  it('should return correct label', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: false,
      },
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );
    expect(
      await wrapper.getByLabelText(
        /Details for appointment on Friday, July 19 12:00 p.m./i,
      ),
    ).to.exist;
  });
  it('should return cancelled label', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: false,
      },
      status: 'cancelled',
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );
    expect(
      await wrapper.getByLabelText(
        /Details for canceled appointment on Friday, July 19 12:00 p.m./i,
      ),
    ).to.exist;
    expect(wrapper.baseElement).to.contain('.usa-label');
    expect(await wrapper.findAllByText(/Canceled/i)).to.exist;
  });
  it('should display dates correctly', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: false,
      },
      status: 'cancelled',
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findAllByText(/Friday, July 19/i)).to.exist;
    expect(await wrapper.findAllByText(/12:00 p.m/i)).to.exist;
  });
  it('should display dates correctly', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isCommunityCare: false,
      },
      status: 'cancelled',
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findAllByText(/Friday, July 19/i)).to.exist;
    expect(await wrapper.findAllByText(/12:00 p.m/i)).to.exist;
    expect(await wrapper.findAllByText(/MT/i)).to.exist;
    expect(await wrapper.findAllByText(/Mountain time/i)).to.exist;
  });
  it('should display phone call text and icon', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isPhoneAppointment: true,
        isCommunityCare: false,
      },
      status: 'cancelled',
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );
    expect(wrapper.baseElement).to.contain('.fa-phone');
    expect(await wrapper.findAllByText(/Phone call/i)).to.exist;
  });
  it('should display details link', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: false,
        isPhoneAppointment: true,
        isCommunityCare: false,
      },
      status: 'cancelled',
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );
    expect(wrapper.getByRole('link')).to.exist;
    // fireEvent.click returns false if Event.preventDefault() is called.
    expect(fireEvent.click(wrapper.getByRole('link'))).to.be.false;
  });
});
