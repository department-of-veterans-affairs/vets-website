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

  it('should render the Next appointments card', () => {
    const appointments = v2.createAppointmentSuccess().data;
    const appts = appointments.map(appointment => appointment.attributes);

    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent appointments={appts} />,
      { initialState },
    );

    tree.getByTestId('health-care-appointments-card');
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
  it('maps state to props correctly', () => {
    const state = {
      health: {
        appointments: {
          fetching: false,
          data: [],
          errors: [],
        },
      },
      hcaEnrollmentStatus: {
        hasServerError: false,
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
      featureToggles: {},
      sm: { unreadCount: { count: 2 } },
    };

    const tree = renderWithStoreAndRouter(
      <ConnectedHealthCareContent isVAPatient />,
      { initialState: state },
    );

    expect(tree.getByText('Messages')).to.exist;
  });
});
