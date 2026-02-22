import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';
import * as utils from 'applications/vaos/services/utils';
import EpsAppointmentDetailsPage from './EpsAppointmentDetailsPage';
import * as actionsModule from '../../../referral-appointments/redux/actions';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { createMockEpsAppointment } from '../../../referral-appointments/utils/appointment';
import * as epsAppointmentUtils from '../../../referral-appointments/utils/appointment';

describe('EpsAppointmentDetailsPage', () => {
  let requestStub;
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
    featureToggles: {
      vaOnlineSchedulingCommunityCareCancellations: false,
    },
  };

  const preFetchedState = {
    referral: {
      appointmentInfoError: false,
      appointmentInfoLoading: false,
    },
    appointmentApi: {
      queries: {
        'getAppointmentInfo("test-appointment-id")': {
          status: 'fulfilled',
          endpointName: 'getAppointmentInfo',
          startedTimeStamp: 1755196851027,
          fulfilledTimeStamp: 1755196851141,
          data: referralAppointmentInfo,
        },
      },
      subscriptions: {
        'getAppointmentInfo("test-appointment-id")': {
          thisIsThePreviousCache: {
            pollingInterval: 0,
          },
        },
      },
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

  const emptyAppointmentState = {
    referral: {
      appointmentInfoError: false,
      appointmentInfoLoading: false,
      referralAppointmentInfo: {},
    },
  };

  beforeEach(() => {
    requestStub = sandbox.stub(utils, 'apiRequestWithUrl');
    sandbox
      .stub(actionsModule, 'setFormCurrentPage')
      .returns({ type: 'SET_FORM_CURRENT_PAGE' });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should fetch appointment info when referralAppointmentInfo is null', async () => {
    requestStub.resolves({ data: referralAppointmentInfo });
    const screen = renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
      store: createTestStore(noAppointmentInfoState),
      path: `/${appointmentId}`,
    });
    await waitFor(() => {
      expect(screen.getByTestId('appointment-card')).to.exist;
    });
    sandbox.assert.calledWith(
      utils.apiRequestWithUrl,
      `/vaos/v2/eps_appointments/${appointmentId}`,
    );
  });

  it('should not fetch appointment info when there is existing appointment data', async () => {
    requestStub.resolves({ data: referralAppointmentInfo });
    const store = createTestStore(preFetchedState);
    const screen = renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
      store,
      path: `/${appointmentId}`,
    });
    await waitFor(() => {
      expect(screen.getByTestId('appointment-card')).to.exist;
    });

    expect(utils.apiRequestWithUrl.called).to.be.false;
  });

  it('should render loading indicator when appointment is loading', async () => {
    requestStub.resolves({ data: referralAppointmentInfo });
    const { container } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(loadingState),
        path: `/${appointmentId}`,
      },
    );

    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should render error alert when there is an error', async () => {
    requestStub.throws(() => new Error());
    const { getByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(initialState),
        path: `/${appointmentId}`,
      },
    );
    await waitFor(() => {
      expect(getByTestId('error-alert')).to.exist;
    });
    expect(getByTestId('error-alert')).to.exist;
  });

  it('should render appointment details when appointment is loaded', async () => {
    const referralAppointmentFuture = {
      ...referralAppointmentInfo,
      attributes: {
        ...referralAppointmentInfo.attributes,
        past: false,
      },
    };
    requestStub.resolves({ data: referralAppointmentFuture });
    const { container, getByText, getByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(initialState),
        path: `/${appointmentId}`,
      },
    );
    await waitFor(() => {
      expect(getByTestId('appointment-card')).to.exist;
    });
    // Check that main container exists
    expect(getByTestId('appointment-card')).to.exist;

    // Check that calendar icon exists
    expect(getByTestId('appointment-card')).to.have.attribute(
      'icon-name',
      'calendar_today',
    );

    // Check heading
    expect(getByText('Community care appointment')).to.exist;

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
        'va-link[text="Find a full list of things to bring to your appointment"]',
      ),
    ).to.exist;

    // Check change appointment text
    expect(
      getByText(/Contact this provider if you need to reschedule or cancel/),
    ).to.exist;
  });

  it('should render provider address and directions link when location is available', async () => {
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
    requestStub.resolves({ data: appointmentWithLocation });

    const { getByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(emptyAppointmentState),
        path: `/${appointmentId}`,
      },
    );
    await waitFor(() => {
      expect(getByTestId('appointment-card')).to.exist;
    });
    expect(getByTestId('address-block')).to.exist;
    expect(getByTestId('directions-link-wrapper')).to.exist;
  });

  it('should render provider phone number when available', async () => {
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
    requestStub.resolves({ data: appointmentWithPhone });
    const { getByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(emptyAppointmentState),
        path: `/${appointmentId}`,
      },
    );
    await waitFor(() => {
      expect(getByTestId('appointment-card')).to.exist;
    });
    expect(getByTestId('clinic-telephone')).to.exist;
  });

  it('should display fallback text when provider data not available', async () => {
    const appointment = {
      ...referralAppointmentInfo,
      attributes: {
        ...referralAppointmentInfo.attributes,
        provider: {
          ...referralAppointmentInfo.attributes.provider,
          name: '',
          // location: {},
          location: {
            ...referralAppointmentInfo.attributes.provider.location,
            name: '',
            address: '',
          },
          phone: '',
        },
      },
    };
    requestStub.resolves({ data: appointment });
    const { getByText, getByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store: createTestStore(emptyAppointmentState),
        path: `/${appointmentId}`,
      },
    );
    await waitFor(() => {
      expect(getByText(/Provider name not available/)).to.exist;
      expect(getByText(/Facility name not available/)).to.exist;
      expect(getByText(/Address not available/)).to.exist;
      expect(getByTestId('main-telephone')).to.exist;
    });
  });

  it('should display correct time with timezone conversion', async () => {
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
    requestStub.resolves({ data: appointmentWithTimeZone });
    const container = renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
      store: createTestStore(initialState),
      path: `/${appointmentId}`,
    });

    await waitFor(() => {
      expect(container.getByTestId('appointment-time')).to.exist;
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
    expect(description.textContent).to.include('Eastern time (ET)'); // Full timezone description
  });

  it('should not show cancel appointment button when community care cancellations flipper is disabled', async () => {
    requestStub.resolves({ data: referralAppointmentInfo });
    const store = createTestStore({
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingCommunityCareCancellations: false,
      },
    });
    const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store,
        path: `/${appointmentId}`,
      },
    );
    await waitFor(() => {
      expect(getByTestId('appointment-card')).to.exist;
    });
    await waitFor(() => {
      expect(queryByTestId('cancel-button')).not.to.exist;
    });
  });

  it('should show cancel appointment button when community care cancellations flipper is enabled', async () => {
    requestStub.resolves({ data: referralAppointmentInfo });
    const store = createTestStore({
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingCommunityCareCancellations: true,
      },
    });
    const { getByTestId } = renderWithStoreAndRouter(
      <EpsAppointmentDetailsPage />,
      {
        store,
        path: `/${appointmentId}`,
      },
    );
    await waitFor(() => {
      expect(getByTestId('appointment-card')).to.exist;
    });
    await waitFor(() => {
      expect(getByTestId('cancel-button')).to.exist;
    });
  });

  describe('Cancellation flow', () => {
    it('should show cancellation layout when cancel button is clicked', async () => {
      requestStub.resolves({ data: referralAppointmentInfo });
      const store = createTestStore({
        ...preFetchedState,
        featureToggles: {
          vaOnlineSchedulingCommunityCareCancellations: true,
        },
      });
      const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store,
          path: `/${appointmentId}`,
        },
      );

      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      const cancelButton = getByTestId('cancel-button');
      cancelButton.click();

      await waitFor(() => {
        expect(queryByTestId('appointment-card')).to.not.exist;
      });
    });

    it('should render "Would you like to cancel this appointment?" heading when cancelling', async () => {
      requestStub.resolves({ data: referralAppointmentInfo });
      const store = createTestStore({
        ...preFetchedState,
        featureToggles: {
          vaOnlineSchedulingCommunityCareCancellations: true,
        },
      });
      const { getByTestId, getByText } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store,
          path: `/${appointmentId}`,
        },
      );

      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      const cancelButton = getByTestId('cancel-button');
      cancelButton.click();

      await waitFor(() => {
        expect(getByText('Would you like to cancel this appointment?')).to
          .exist;
      });
    });

    it('should return to appointment details when "No, do not cancel" is clicked', async () => {
      requestStub.resolves({ data: referralAppointmentInfo });
      const store = createTestStore({
        ...preFetchedState,
        featureToggles: {
          vaOnlineSchedulingCommunityCareCancellations: true,
        },
      });
      const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store,
          path: `/${appointmentId}`,
        },
      );

      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      // Click cancel appointment button
      const cancelButton = getByTestId('cancel-button');
      cancelButton.click();

      await waitFor(() => {
        expect(getByTestId('do-not-cancel-button')).to.exist;
      });

      // Click "No, do not cancel"
      const doNotCancelButton = getByTestId('do-not-cancel-button');
      doNotCancelButton.click();

      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
        expect(queryByTestId('do-not-cancel-button')).to.not.exist;
      });
    });

    it('should return to appointment details when back link is clicked during cancellation', async () => {
      requestStub.resolves({ data: referralAppointmentInfo });
      const store = createTestStore({
        ...preFetchedState,
        featureToggles: {
          vaOnlineSchedulingCommunityCareCancellations: true,
        },
      });
      const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store,
          path: `/${appointmentId}`,
        },
      );

      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      // Click cancel appointment button
      const cancelButton = getByTestId('cancel-button');
      cancelButton.click();

      await waitFor(() => {
        expect(getByTestId('do-not-cancel-button')).to.exist;
      });

      // Click back link
      const backLink = getByTestId('back-link');
      backLink.click();

      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
        expect(queryByTestId('do-not-cancel-button')).to.not.exist;
      });
    });

    it('should show success message when "Yes, cancel appointment" is clicked', async () => {
      requestStub.resolves({ data: referralAppointmentInfo });
      const store = createTestStore({
        ...preFetchedState,
        featureToggles: {
          vaOnlineSchedulingCommunityCareCancellations: true,
        },
      });
      const {
        getByTestId,
        getByText,
        queryByTestId,
      } = renderWithStoreAndRouter(<EpsAppointmentDetailsPage />, {
        store,
        path: `/${appointmentId}`,
      });

      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      // Click cancel appointment button
      const cancelButton = getByTestId('cancel-button');
      cancelButton.click();

      await waitFor(() => {
        expect(getByTestId('cancel-button')).to.exist;
      });

      // Click "Yes, cancel appointment"
      const confirmCancelButton = getByTestId('cancel-button');
      confirmCancelButton.click();

      await waitFor(() => {
        expect(getByText('You have canceled your appointment')).to.exist;
        expect(queryByTestId('cancel-button')).to.not.exist;
        expect(queryByTestId('do-not-cancel-button')).to.not.exist;
      });
    });

    it('should show "Go to your referral" link after cancellation is confirmed', async () => {
      requestStub.resolves({ data: referralAppointmentInfo });
      const store = createTestStore({
        ...preFetchedState,
        featureToggles: {
          vaOnlineSchedulingCommunityCareCancellations: true,
        },
      });
      const { getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store,
          path: `/${appointmentId}`,
        },
      );

      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      // Click cancel appointment button
      const cancelButton = getByTestId('cancel-button');
      cancelButton.click();

      await waitFor(() => {
        expect(getByTestId('cancel-button')).to.exist;
      });

      // Click "Yes, cancel appointment"
      const confirmCancelButton = getByTestId('cancel-button');
      confirmCancelButton.click();

      await waitFor(() => {
        expect(getByTestId('go-to-referral-link')).to.exist;
      });
    });

    it('should not show appointment detail card after cancellation is confirmed', async () => {
      requestStub.resolves({ data: referralAppointmentInfo });
      const store = createTestStore({
        ...preFetchedState,
        featureToggles: {
          vaOnlineSchedulingCommunityCareCancellations: true,
        },
      });
      const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store,
          path: `/${appointmentId}`,
        },
      );

      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      // Click cancel appointment button
      const cancelButton = getByTestId('cancel-button');
      cancelButton.click();

      await waitFor(() => {
        expect(getByTestId('cancel-button')).to.exist;
      });

      // Click "Yes, cancel appointment"
      const confirmCancelButton = getByTestId('cancel-button');
      confirmCancelButton.click();

      await waitFor(() => {
        expect(queryByTestId('appointment-card')).to.not.exist;
      });
    });
  });

  describe('Cancelled appointments', () => {
    it('should display cancelled appointment alert when status is cancelled', async () => {
      const cancelledAppointment = {
        ...referralAppointmentInfo,
        attributes: {
          ...referralAppointmentInfo.attributes,
          status: 'cancelled',
          cancelationReason: {
            coding: [{ code: 'pat' }],
          },
        },
      };
      requestStub.resolves({ data: cancelledAppointment });
      const { getByText, getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store: createTestStore(initialState),
          path: `/${appointmentId}`,
        },
      );
      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      expect(getByText(/You canceled this appointment/)).to.exist;
      expect(getByText(/If you want to reschedule, call us or schedule/)).to
        .exist;
    });

    it('should show "The facility canceled" when cancelation reason is not patient', async () => {
      const cancelledAppointment = {
        ...referralAppointmentInfo,
        attributes: {
          ...referralAppointmentInfo.attributes,
          status: 'cancelled',
          cancelationReason: {
            coding: [{ code: 'clinic' }],
          },
        },
      };
      requestStub.resolves({ data: cancelledAppointment });
      const { getByText, getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store: createTestStore(initialState),
          path: `/${appointmentId}`,
        },
      );
      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      expect(getByText(/canceled this appointment/)).to.exist;
      expect(getByText(/canceled this appointment/)).to.not.contain('You');
    });

    it('should display provider name in cancellation alert when available', async () => {
      const cancelledAppointment = {
        ...referralAppointmentInfo,
        attributes: {
          ...referralAppointmentInfo.attributes,
          status: 'cancelled',
          cancelationReason: {
            coding: [{ code: 'clinic' }],
          },
          provider: {
            ...referralAppointmentInfo.attributes.provider,
            location: {
              ...referralAppointmentInfo.attributes.provider.location,
              name: 'Test Provider Location',
            },
          },
        },
      };
      requestStub.resolves({ data: cancelledAppointment });
      const { getByText, getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store: createTestStore(initialState),
          path: `/${appointmentId}`,
        },
      );
      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      expect(getByText(/Test Provider Location canceled this appointment/)).to
        .exist;
    });

    it('should show "Go to your referral" link in cancellation alert', async () => {
      const cancelledAppointment = {
        ...referralAppointmentInfo,
        attributes: {
          ...referralAppointmentInfo.attributes,
          status: 'cancelled',
          cancelationReason: {
            coding: [{ code: 'pat' }],
          },
          referralId: 'test-referral-123',
        },
      };
      requestStub.resolves({ data: cancelledAppointment });
      const { container, getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store: createTestStore(initialState),
          path: `/${appointmentId}`,
        },
      );
      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      const link = container.querySelector(
        'va-link[href*="/my-health/appointments/schedule-referral?id=test-referral-123"]',
      );
      expect(link).to.exist;
      expect(link).to.have.attribute(
        'text',
        'Go to your referral to schedule an appointment',
      );
    });

    it('should not show cancel button when appointment is already cancelled', async () => {
      const cancelledAppointment = {
        ...referralAppointmentInfo,
        attributes: {
          ...referralAppointmentInfo.attributes,
          status: 'cancelled',
          cancelationReason: {
            coding: [{ code: 'pat' }],
          },
        },
      };
      requestStub.resolves({ data: cancelledAppointment });
      const store = createTestStore({
        ...initialState,
        featureToggles: {
          vaOnlineSchedulingCommunityCareCancellations: true,
        },
      });
      const { queryByTestId, getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store,
          path: `/${appointmentId}`,
        },
      );
      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      expect(queryByTestId('cancel-button')).to.not.exist;
    });

    it('should not show add to calendar button when appointment is cancelled', async () => {
      const cancelledAppointment = {
        ...referralAppointmentInfo,
        attributes: {
          ...referralAppointmentInfo.attributes,
          status: 'cancelled',
          past: false,
        },
      };
      requestStub.resolves({ data: cancelledAppointment });
      const { container, getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store: createTestStore(initialState),
          path: `/${appointmentId}`,
        },
      );
      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      const addToCalendarButton = container.querySelector(
        'va-button[text*="calendar"]',
      );
      expect(addToCalendarButton).to.not.exist;
    });

    it('should display "Community care appointment" title for cancelled appointments', async () => {
      const cancelledAppointment = {
        ...referralAppointmentInfo,
        attributes: {
          ...referralAppointmentInfo.attributes,
          status: 'cancelled',
          past: false,
        },
      };
      requestStub.resolves({ data: cancelledAppointment });
      const { getByText, getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store: createTestStore(initialState),
          path: `/${appointmentId}`,
        },
      );
      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      expect(getByText('Community care appointment')).to.exist;
    });

    it('should display "Past community care appointment" title for past cancelled appointments', async () => {
      const cancelledAppointment = {
        ...referralAppointmentInfo,
        attributes: {
          ...referralAppointmentInfo.attributes,
          status: 'cancelled',
          past: true,
        },
      };
      requestStub.resolves({ data: cancelledAppointment });
      const { getByText, getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentDetailsPage />,
        {
          store: createTestStore(initialState),
          path: `/${appointmentId}`,
        },
      );
      await waitFor(() => {
        expect(getByTestId('appointment-card')).to.exist;
      });

      expect(getByText('Past community care appointment')).to.exist;
    });
  });
});
