import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import EpsAppointmentDetailsPage from './EpsAppointmentDetailsPage';
import * as actionsModule from './redux/actions';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { createMockEpsAppointment } from './utils/appointment';
import * as epsAppointmentUtils from './utils/appointment';

describe('EpsAppointmentDetailsPage', () => {
  const appointmentId = 'test-appointment-id';
  const referralAppointmentInfo = createMockEpsAppointment(
    appointmentId,
    'booked',
    epsAppointmentUtils.appointmentData,
  );

  const sandbox = sinon.createSandbox();

  const initialState = {
    referral: {
      appointmentInfoError: false,
      appointmentInfoLoading: false,
      referralAppointmentInfo,
    },
  };

  const noAppointmentInfoState = {
    referral: {
      appointmentInfoError: false,
      appointmentInfoLoading: false,
      referralAppointmentInfo: null,
    },
  };

  const loadingState = {
    referral: {
      appointmentInfoError: false,
      appointmentInfoLoading: true,
      referralAppointmentInfo: null,
    },
  };

  const errorState = {
    referral: {
      appointmentInfoError: true,
      appointmentInfoLoading: false,
      referralAppointmentInfo: null,
    },
  };

  const emptyAppointmentState = {
    referral: {
      appointmentInfoError: false,
      appointmentInfoLoading: false,
      referralAppointmentInfo: {},
    },
  };

  beforeEach(() => {
    sandbox
      .stub(actionsModule, 'setFormCurrentPage')
      .returns({ type: 'SET_FORM_CURRENT_PAGE' });
    sandbox
      .stub(actionsModule, 'fetchAppointmentInfo')
      .returns(referralAppointmentInfo);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set form current page to details on mount', () => {
    renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
      store: createTestStore(initialState),
      path: `/${appointmentId}`,
    });
    expect(actionsModule.setFormCurrentPage.calledWith('details')).to.be.true;
  });

  it('should fetch appointment info when referralAppointmentInfo is null', () => {
    renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
      store: createTestStore(noAppointmentInfoState),
      path: `/${appointmentId}`,
    });

    expect(actionsModule.fetchAppointmentInfo.calledWith(appointmentId)).to.be
      .true;
  });

  it('should fetch appointment info when referralAppointmentInfo exists but is empty', () => {
    renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
      store: createTestStore(emptyAppointmentState),
      path: `/${appointmentId}`,
    });

    expect(actionsModule.fetchAppointmentInfo.called).to.be.true;
  });

  it('should not fetch appointment info when there is existing appointment data', () => {
    renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
      store: createTestStore(initialState),
      path: `/${appointmentId}`,
    });

    expect(actionsModule.fetchAppointmentInfo.called).to.be.false;
  });

  it('should not fetch when appointment info is loading', () => {
    renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
      store: createTestStore(loadingState),
      path: `/${appointmentId}`,
    });

    expect(actionsModule.fetchAppointmentInfo.called).to.be.false;
  });

  it('should render loading indicator when appointment is loading', () => {
    const { container } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(loadingState),
        path: `/${appointmentId}`,
      },
    );

    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should not fetch when there is an error', () => {
    renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
      store: createTestStore(errorState),
      path: `/${appointmentId}`,
    });

    expect(actionsModule.fetchAppointmentInfo.called).to.be.false;
  });

  it('should render error alert when there is an error', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(errorState),
        path: `/${appointmentId}`,
      },
    );

    expect(getByTestId('error-alert')).to.exist;
  });

  it('should render appointment details when appointment is loaded', () => {
    const { container, getByText, getByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(initialState),
        path: `/${appointmentId}`,
      },
    );

    // Check that main container exists
    expect(getByTestId('appointment-card')).to.exist;

    // Check that calendar icon exists
    expect(getByTestId('appointment-icon')).to.exist;

    // Check heading
    expect(getByText('Community Care Appointment')).to.exist;

    // Check sections exist
    expect(getByText('When')).to.exist;
    expect(getByText('Provider')).to.exist;
    expect(getByText('Prepare for your appointment')).to.exist;
    expect(getByText('Need to make changes?')).to.exist;

    // Check specific content from appointment data
    const { attributes } = referralAppointmentInfo;
    expect(getByText(attributes.provider.location.name)).to.exist;

    // Check preparation instructions
    expect(getByText(/Bring your insurance cards/)).to.exist;
    expect(
      container.querySelector(
        'va-link[text="Find out what to bring to your appointment"]',
      ),
    ).to.exist;

    // Check change appointment text
    expect(
      getByText(/Contact this provider if you need to reschedule or cancel/),
    ).to.exist;
  });

  it('should render provider address and directions link when location is available', () => {
    const appointmentWithLocation = {
      ...referralAppointmentInfo,
      attributes: {
        ...referralAppointmentInfo.attributes,
        provider: {
          ...referralAppointmentInfo.attributes.provider,
          address: {
            street1: '123 Main St',
            city: 'Anytown',
            state: 'NY',
            zip: '12345',
          },
        },
      },
    };

    const stateWithLocation = {
      referral: {
        ...initialState.referral,
        referralAppointmentInfo: appointmentWithLocation,
      },
    };

    const { getByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(stateWithLocation),
        path: `/${appointmentId}`,
      },
    );

    expect(getByTestId('address-block')).to.exist;
    expect(getByTestId('directions-link-wrapper')).to.exist;
  });

  it('should render provider phone number when available', () => {
    const appointmentWithPhone = {
      ...referralAppointmentInfo,
      attributes: {
        ...referralAppointmentInfo.attributes,
        provider: {
          ...referralAppointmentInfo.attributes.provider,
          phone: '555-123-4567',
        },
      },
    };

    const stateWithPhone = {
      referral: {
        ...initialState.referral,
        referralAppointmentInfo: appointmentWithPhone,
      },
    };

    const { getByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(stateWithPhone),
        path: `/${appointmentId}`,
      },
    );

    expect(getByTestId('provider-telephone')).to.exist;
  });

  it('should display correct time with timezone conversion', () => {
    // Create appointment with specific UTC time and timezone
    const appointmentWithTimeZone = {
      ...referralAppointmentInfo,
      attributes: {
        ...referralAppointmentInfo.attributes,
        start: '2024-11-18T18:30:00Z', // 6:30 PM UTC
        provider: {
          ...referralAppointmentInfo.attributes.provider,
          location: {
            ...referralAppointmentInfo.attributes.provider.location,
            timeZone: 'America/New_York', // EST/EDT
          },
        },
      },
    };

    const stateWithTimeZone = {
      referral: {
        ...initialState.referral,
        referralAppointmentInfo: appointmentWithTimeZone,
      },
    };

    const container = renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
      store: createTestStore(stateWithTimeZone),
      path: `/${appointmentId}`,
    });

    // The AppointmentTime component should display the time in the provider's timezone
    // 18:30 UTC should convert to either:
    // - 1:30 PM EST (during standard time)
    // - 2:30 PM EDT (during daylight time)
    const timeElement = container.getByTestId('appointment-time');
    expect(timeElement).to.exist;

    // Check that the time displayed is either 1:30 PM or 2:30 PM (depending on DST)
    const timeText = timeElement.textContent;
    const hasCorrectTime =
      timeText.includes('1:30') || timeText.includes('2:30');
    expect(hasCorrectTime).to.be.true;

    // Verify it's p.m. time
    const hasPM = timeText.includes('p.m.');
    expect(hasPM).to.be.true;

    // Verify timezone abbreviation is displayed
    const abbreviation = container.getByTestId('appointment-time-abbreviation');
    expect(abbreviation).to.exist;
    expect(abbreviation.textContent).to.include('ET'); // ET should appear

    const description = container.getByTestId('appointment-time-description');
    expect(description).to.exist;
    expect(description.textContent).to.include('Eastern Standard Time'); // Full timezone description
  });
});
