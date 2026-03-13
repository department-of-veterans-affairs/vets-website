import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';
import ConnectedHealthCareContent, {
  UnconnectedHealthCareContent,
} from '../../../components/health-care/HealthCareContent';
import { v2 } from '../../../mocks/appointments';

describe('<UnconnectedHealthCareContent />', () => {
  const initialState = {
    user: {},
  };

  it('should render', () => {
    const tree = renderWithStoreAndRouter(<UnconnectedHealthCareContent />, {
      initialState,
    });

    tree.getByTestId('no-health-care-notice');
    expect(tree.container.querySelector('va-loading-indicator')).to.not.exist;
  });

  it('should render the loading indicator', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent shouldShowLoadingIndicator />,
      { initialState },
    );

    expect(tree.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should render the HealthcareError', () => {
    // delete instances of Toggler when errors are launched
    const initialErrorState = {
      featureToggles: {
        [Toggler.TOGGLE_NAMES.myVaUpdateErrorsWarnings]: true,
      },
    };
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent hasAppointmentsError />,
      { initialErrorState },
    );
    tree.getByTestId('appointments-error');
  });

  it('should render the Next appointments cards for the first two appointments', () => {
    const appointments = v2.createAppointmentSuccess().data;
    const appts = appointments.map(appointment => appointment.attributes);

    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent appointments={appts} />,
      { initialState },
    );

    const cards = tree.getAllByTestId('health-care-appointments-card');
    expect(cards).to.have.lengthOf(2);
  });

  it('should render one Next appointments card when there is one appointment', () => {
    const appointments = v2.createAppointmentSuccess().data;
    const appts = appointments
      .map(appointment => appointment.attributes)
      .slice(0, 1);

    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent appointments={appts} />,
      { initialState },
    );

    const cards = tree.getAllByTestId('health-care-appointments-card');
    expect(cards).to.have.lengthOf(1);
  });

  it('should render the no upcoming appointments text', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent dataLoadingDisabled isVAPatient />,
      { initialState },
    );

    tree.getByTestId('no-upcoming-appointments-card');
  });

  it('should render the health enrollment error', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent hasHealthEnrollmentError />,
      { initialState },
    );

    tree.getByTestId('healthcare-error');
  });

  it('should render the messages error when hasInboxError', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent isVAPatient hasInboxError />,
      { initialState },
    );

    tree.getByTestId('messages-error');
  });

  it('should render the no unread messages card', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent isVAPatient unreadMessagesCount={0} />,
      { initialState },
    );

    tree.getByTestId('no-unread-messages-card');
  });

  it('should render the unread messages card with singular message', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent isVAPatient unreadMessagesCount={1} />,
      { initialState },
    );

    tree.getByTestId('upread-messages-card');
    tree.getByText('1 unread message');
  });

  it('should render the unread messages card with plural messages', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent isVAPatient unreadMessagesCount={5} />,
      { initialState },
    );

    tree.getByTestId('upread-messages-card');
    tree.getByText('5 unread messages');
  });

  it('should not render messages section when not a VA patient', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent unreadMessagesCount={3} />,
      { initialState },
    );

    expect(tree.queryByText('Messages')).to.not.exist;
  });

  it('should not show appointments for LOA1 users', () => {
    const v2Appointments = v2.createAppointmentSuccess().data;
    const appts = v2Appointments.map(appointment => appointment.attributes);

    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent isVAPatient isLOA1 appointments={appts} />,
      { initialState },
    );

    expect(tree.queryByTestId('health-care-appointments-card')).to.not.exist;
  });

  it('should not render no-upcoming-appointments card for Cerner patients', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent isVAPatient isCernerPatient />,
      { initialState },
    );

    expect(tree.queryByTestId('no-upcoming-appointments-card')).to.not.exist;
  });

  it('should show Appointments heading for VA patients', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent isVAPatient />,
      { initialState },
    );

    expect(tree.getByText('Appointments')).to.exist;
  });

  it('should render healthcare error with warning status when toggle is on', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent hasHealthEnrollmentError />,
      {
        initialState: {
          featureToggles: {
            [Toggler.TOGGLE_NAMES.myVaUpdateErrorsWarnings]: true,
          },
        },
      },
    );

    const alert = tree.getByTestId('healthcare-error');
    expect(alert.getAttribute('status')).to.equal('warning');
  });
});

describe('Connected HealthCareContent', () => {
  const reducers = {
    health: (state = {}) => state,
    hcaEnrollmentStatus: (state = {}) => state,
  };

  const createState = ({
    appointmentsData = [],
    appointmentsErrors = [],
    hasServerError = false,
    unreadCount = 2,
    unreadCountErrors = [],
  } = {}) => ({
    health: {
      appointments: {
        fetching: false,
        data: appointmentsData,
        errors: appointmentsErrors,
      },
      msg: {
        unreadCount: {
          count: unreadCount,
          errors: unreadCountErrors,
        },
      },
    },
    hcaEnrollmentStatus: {
      hasServerError,
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get: () => {} },
      dismissedDowntimeWarnings: [],
    },
    user: {
      profile: {
        facilities: [],
      },
    },
    featureToggles: {
      [Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled]: true,
    },
  });

  it('maps state to props correctly', () => {
    const tree = renderWithStoreAndRouter(
      <ConnectedHealthCareContent isVAPatient />,
      { initialState: createState(), reducers },
    );

    expect(tree.getByRole('heading', { name: 'Appointments', level: 3 })).to
      .exist;
    expect(tree.getByRole('heading', { name: 'Messages', level: 3 })).to.exist;
    expect(tree.getByText('2 unread messages')).to.exist;
  });

  it('shows appointments error text when appointments request fails', () => {
    const tree = renderWithStoreAndRouter(
      <ConnectedHealthCareContent isVAPatient />,
      {
        initialState: createState({
          appointmentsErrors: [{ code: '500' }],
        }),
        reducers,
      },
    );

    tree.getByTestId('appointments-error');
    expect(tree.getByRole('heading', { name: 'Appointments', level: 3 })).to
      .exist;
    expect(tree.getByRole('heading', { name: 'Messages', level: 3 })).to.exist;
  });

  it('shows no healthcare notice for users without VA healthcare', () => {
    const tree = renderWithStoreAndRouter(<ConnectedHealthCareContent />, {
      initialState: createState(),
      reducers,
    });

    tree.getByTestId('no-health-care-notice');
    tree.getByTestId('my-healthevet-link');
    expect(tree.queryByRole('heading', { name: 'Appointments', level: 3 })).to
      .not.exist;
    expect(tree.queryByRole('heading', { name: 'Messages', level: 3 })).to.not
      .exist;
  });

  it('shows no upcoming appointments card when there are no appointments', () => {
    const tree = renderWithStoreAndRouter(
      <ConnectedHealthCareContent isVAPatient />,
      { initialState: createState({ applicationData: [] }), reducers },
    );

    tree.getByTestId('no-upcoming-appointments-card');
    tree.getByRole('heading', { name: 'Appointments', level: 3 });
    tree.getByTestId('manage-all-appointments-link');
    expect(tree.queryByTestId('application-appointment-link')).to.not.exist;
  });

  it('shows an appointment card when there is an appointment in the next 30 days', () => {
    const appointments = v2
      .createAppointmentSuccess({ startsInDays: [30] })
      .data.map(appointment => appointment.attributes);

    const tree = renderWithStoreAndRouter(
      <ConnectedHealthCareContent isVAPatient />,
      {
        initialState: createState({ appointmentsData: appointments }),
        reducers,
      },
    );

    tree.getByTestId('health-care-appointments-card');
    expect(tree.queryByTestId('no-upcoming-appointments-card')).to.not.exist;
    tree.getByRole('heading', { name: 'Upcoming appointment', level: 4 });
    tree.getByTestId('application-appointment-link');
    tree.getByTestId('manage-all-appointments-link');
  });

  it('shows no unread messages card when unread count is zero', () => {
    const tree = renderWithStoreAndRouter(
      <ConnectedHealthCareContent isVAPatient />,
      {
        initialState: createState({ unreadCount: 0 }),
        reducers,
      },
    );

    tree.getByTestId('no-unread-messages-card');
    expect(tree.queryByTestId('messages-error')).to.not.exist;
  });

  it('shows messages error when unread count request fails', () => {
    const tree = renderWithStoreAndRouter(
      <ConnectedHealthCareContent isVAPatient />,
      {
        initialState: createState({ unreadCountErrors: [{ code: '500' }] }),
        reducers,
      },
    );

    tree.getByTestId('messages-error');
    expect(tree.queryByTestId('no-unread-messages-card')).to.not.exist;
    tree.getByRole('heading', { name: 'Appointments', level: 3 });
    tree.getByRole('heading', { name: 'Messages', level: 3 });
    tree.getByTestId('my-healthevet-link');
  });
});
