import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles/Toggler';

import { notificationsReducer } from '../../../../common/reducers/notifications';

import NotificationsConnected, {
  Notifications,
} from '../../../components/notifications/Notifications';

const debtTemplateId = 'f9947b27-df3b-4b09-875c-7f76594d766d';

const makeNotification = (id, overrides = {}) => ({
  id,
  type: 'onsite_notification',
  attributes: {
    createdAt: '2023-05-15T19:00:00Z',
    dismissed: false,
    templateId: debtTemplateId,
    updatedAt: '2023-05-15T19:00:00Z',
    vaProfileId: '1',
    ...overrides,
  },
});

describe('<Notifications />', () => {
  let sandbox;
  let getNotificationsSpy;
  const baseToggleState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.myVaEnableNotificationComponent]: false,
      [Toggler.TOGGLE_NAMES.myVaUpdateErrorsWarnings]: false,
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getNotificationsSpy = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('calls getNotifications on mount', () => {
    renderWithStoreAndRouter(
      <Notifications
        getNotifications={getNotificationsSpy}
        notifications={[]}
      />,
      { initialState: baseToggleState },
    );

    expect(getNotificationsSpy.calledOnce).to.be.true;
  });

  it('renders the Notifications heading when there are debt notifications', () => {
    const notifications = [makeNotification('1')];

    const { getByText } = renderWithStoreAndRouter(
      <Notifications
        getNotifications={getNotificationsSpy}
        notifications={notifications}
      />,
      { initialState: baseToggleState },
    );

    expect(getByText('Notifications')).to.exist;
  });

  it('renders multiple debt notifications', () => {
    const notifications = [
      makeNotification('1', { createdAt: '2023-05-15T19:00:00Z' }),
      makeNotification('2', { createdAt: '2023-05-14T19:00:00Z' }),
    ];

    const { getAllByText, getByText } = renderWithStoreAndRouter(
      <Notifications
        getNotifications={getNotificationsSpy}
        notifications={notifications}
      />,
      { initialState: baseToggleState },
    );

    expect(getAllByText('You have new debt.').length).to.eq(2);
    expect(getAllByText('Manage your VA debt').length).to.eq(2);
    expect(getByText('Monday, May 15, 2023')).to.exist;
    expect(getByText('Sunday, May 14, 2023')).to.exist;
  });

  context('returns null', () => {
    it('when notifications array is empty', () => {
      const { container } = renderWithStoreAndRouter(
        <Notifications
          getNotifications={getNotificationsSpy}
          notifications={[]}
        />,
        { initialState: baseToggleState },
      );

      expect(container.querySelector('[data-testid="dashboard-notifications"]'))
        .to.not.exist;
    });

    it('when there are no debt-template notifications', () => {
      const notifications = [
        makeNotification('1', { templateId: 'some-other-template' }),
      ];

      const { container } = renderWithStoreAndRouter(
        <Notifications
          getNotifications={getNotificationsSpy}
          notifications={notifications}
        />,
        { initialState: baseToggleState },
      );

      expect(container.querySelector('[data-testid="dashboard-notifications"]'))
        .to.not.exist;
    });

    it('when notificationsError is true', () => {
      const notifications = [makeNotification('1')];

      const { container } = renderWithStoreAndRouter(
        <Notifications
          getNotifications={getNotificationsSpy}
          notifications={notifications}
          notificationsError
        />,
        { initialState: baseToggleState },
      );

      expect(container.querySelector('[data-testid="dashboard-notifications"]'))
        .to.not.exist;
    });
  });

  context('dismissal error', () => {
    it('shows the dismissal error alert when dismissalError is true', () => {
      const notifications = [makeNotification('1')];

      const { getByTestId, getByText } = renderWithStoreAndRouter(
        <Notifications
          getNotifications={getNotificationsSpy}
          notifications={notifications}
          dismissalError
        />,
        { initialState: baseToggleState },
      );

      expect(getByTestId('dashboard-notifications-error')).to.exist;
      expect(getByText(/Can.t dismiss notification/)).to.exist;
      expect(
        getByText(
          /Something went wrong on our end, and we can.t dismiss this notification/,
        ),
      ).to.exist;
    });

    it('does not show the dismissal error alert when dismissalError is false', () => {
      const notifications = [makeNotification('1')];

      const { queryByTestId } = renderWithStoreAndRouter(
        <Notifications
          getNotifications={getNotificationsSpy}
          notifications={notifications}
        />,
        { initialState: baseToggleState },
      );

      expect(queryByTestId('dashboard-notifications-error')).to.not.exist;
    });

    it('renders the dismissal error with status "error" when myVaUpdateErrorsWarnings toggle is off', () => {
      const notifications = [makeNotification('1')];

      const { container } = renderWithStoreAndRouter(
        <Notifications
          getNotifications={getNotificationsSpy}
          notifications={notifications}
          dismissalError
        />,
        {
          initialState: {
            featureToggles: {
              ...baseToggleState.featureToggles,
              [Toggler.TOGGLE_NAMES.myVaUpdateErrorsWarnings]: false,
            },
          },
        },
      );

      const errorAlert = container.querySelector(
        '[data-testid="dashboard-notifications-error"] va-alert',
      );
      expect(errorAlert.getAttribute('status')).to.equal('error');
    });

    it('renders the dismissal error with status "warning" when myVaUpdateErrorsWarnings toggle is on', () => {
      const notifications = [makeNotification('1')];

      const { container } = renderWithStoreAndRouter(
        <Notifications
          getNotifications={getNotificationsSpy}
          notifications={notifications}
          dismissalError
        />,
        {
          initialState: {
            featureToggles: {
              ...baseToggleState.featureToggles,
              [Toggler.TOGGLE_NAMES.myVaUpdateErrorsWarnings]: true,
            },
          },
        },
      );

      const errorAlert = container.querySelector(
        '[data-testid="dashboard-notifications-error"] va-alert',
      );
      expect(errorAlert.getAttribute('status')).to.equal('warning');
    });
  });

  context('feature toggle: myVaEnableNotificationComponent', () => {
    it('renders DebtNotificationAlert when toggle is disabled', () => {
      const notifications = [makeNotification('1')];

      const { getByTestId } = renderWithStoreAndRouter(
        <Notifications
          getNotifications={getNotificationsSpy}
          notifications={notifications}
        />,
        {
          initialState: {
            featureToggles: {
              ...baseToggleState.featureToggles,
              [Toggler.TOGGLE_NAMES.myVaEnableNotificationComponent]: false,
            },
          },
        },
      );

      expect(getByTestId('dashboard-notification-alert')).to.exist;
    });

    it('renders TestNotification when toggle is enabled', () => {
      const notifications = [makeNotification('1')];

      const { getByTestId } = renderWithStoreAndRouter(
        <Notifications
          getNotifications={getNotificationsSpy}
          notifications={notifications}
        />,
        {
          initialState: {
            featureToggles: {
              ...baseToggleState.featureToggles,
              [Toggler.TOGGLE_NAMES.myVaEnableNotificationComponent]: true,
            },
          },
        },
      );

      expect(getByTestId('onsite-notification-card')).to.exist;
    });
  });

  context('connected component', () => {
    const makeConnectedState = (overrides = {}) => ({
      ...baseToggleState,
      notifications: {
        notifications: [makeNotification('1')],
        dismissalError: false,
        notificationError: false,
        isLoading: false,
        ...overrides,
      },
    });

    it('renders via the default connected export', () => {
      const { getByText } = renderWithStoreAndRouter(
        <NotificationsConnected />,
        {
          initialState: makeConnectedState(),
          reducers: {
            notifications: notificationsReducer,
          },
        },
      );

      expect(getByText('Notifications')).to.exist;
    });

    it('maps notificationError from state to notificationsError prop', () => {
      const { container } = renderWithStoreAndRouter(
        <NotificationsConnected />,
        {
          initialState: makeConnectedState({ notificationError: true }),
          reducers: {
            notifications: notificationsReducer,
          },
        },
      );

      expect(container.querySelector('[data-testid="dashboard-notifications"]'))
        .to.not.exist;
    });

    it('maps dismissalError from state', () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <NotificationsConnected />,
        {
          initialState: makeConnectedState({ dismissalError: true }),
          reducers: {
            notifications: notificationsReducer,
          },
        },
      );

      expect(getByTestId('dashboard-notifications-error')).to.exist;
    });
  });
});
