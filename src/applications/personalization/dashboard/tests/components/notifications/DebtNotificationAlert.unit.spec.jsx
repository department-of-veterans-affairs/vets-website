import React from 'react';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import * as recordEventModule from '~/platform/monitoring/record-event';

import DebtNotificationAlertConnected, {
  DebtNotificationAlert,
} from '../../../components/notifications/DebtNotificationAlert';

const makeNotification = (overrides = {}) => ({
  id: '12345',
  type: 'onsite_notification',
  attributes: {
    createdAt: '2023-05-14T12:00:00Z',
    dismissed: false,
    templateId: 'abc-xyz',
    updatedAt: '2023-05-14T12:00:00Z',
    vaProfileId: '1',
    ...overrides,
  },
});

describe('<DebtNotificationAlert />', () => {
  let sandbox;
  let dismissNotificationSpy;
  let recordEventStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dismissNotificationSpy = sandbox.spy();
    recordEventStub = sandbox
      .stub(recordEventModule, 'default')
      .callsFake(() => {});
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders the notification alert container', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <DebtNotificationAlert
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    expect(getByTestId('dashboard-notification-alert')).to.exist;
  });

  it('renders inside a DashboardWidgetWrapper', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <DebtNotificationAlert
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    expect(getByTestId('dashboard-widget-wrapper')).to.exist;
  });

  it('renders a VaAlert with status "warning"', () => {
    const notification = makeNotification();
    const { container } = render(
      <DebtNotificationAlert
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('warning');
  });

  it('renders the "You have new debt." text', () => {
    const notification = makeNotification();
    const { getByText } = render(
      <DebtNotificationAlert
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    expect(getByText('You have new debt.')).to.exist;
  });

  it('renders the "Manage your VA debt" link', () => {
    const notification = makeNotification();
    const { getByText } = render(
      <DebtNotificationAlert
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    expect(getByText('Manage your VA debt')).to.exist;
  });

  it('links to the debt summary page', () => {
    const notification = makeNotification();
    const { getByText } = render(
      <DebtNotificationAlert
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const link = getByText('Manage your VA debt').closest('a');
    expect(link.getAttribute('href')).to.equal(
      '/manage-va-debt/summary/debt-balances',
    );
  });

  it('formats and displays the createdAt date', () => {
    const notification = makeNotification({
      createdAt: '2023-05-14T12:00:00Z',
    });
    const { getByText } = render(
      <DebtNotificationAlert
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    expect(getByText('Sunday, May 14, 2023')).to.exist;
  });

  it('formats a different createdAt date correctly', () => {
    const notification = makeNotification({
      createdAt: '2024-12-25T08:00:00Z',
    });
    const { getByText } = render(
      <DebtNotificationAlert
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    expect(getByText('Wednesday, Dec 25, 2024')).to.exist;
  });

  it('sets closeBtnAriaLabel on the alert', () => {
    const notification = makeNotification();
    const { container } = render(
      <DebtNotificationAlert
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const alert = container.querySelector('va-alert');
    expect(alert.getAttribute('close-btn-aria-label')).to.equal(
      'Close notification',
    );
  });

  context('onCloseEvent', () => {
    it('calls dismissNotification with the notification id', () => {
      const notification = makeNotification();
      const { container } = render(
        <DebtNotificationAlert
          notification={notification}
          dismissNotification={dismissNotificationSpy}
        />,
      );

      const alert = container.querySelector('va-alert');
      const closeEvent = new CustomEvent('closeEvent');
      fireEvent(alert, closeEvent);

      expect(dismissNotificationSpy.calledOnce).to.be.true;
      expect(dismissNotificationSpy.calledWith('12345')).to.be.true;
    });
  });

  context('recordEvent on CTA link click', () => {
    it('calls recordEvent when the Manage your VA debt link is clicked', () => {
      const notification = makeNotification();
      const { getByText } = render(
        <DebtNotificationAlert
          notification={notification}
          dismissNotification={dismissNotificationSpy}
        />,
      );

      const link = getByText('Manage your VA debt').closest('a');
      link.click();
      expect(recordEventStub.calledOnce).to.be.true;
      expect(
        recordEventStub.calledWith({
          event: 'dashboard-navigation',
          'dashboard-action': 'view-link-from-notifications',
          'dashboard-product': 'view-manage-va-debt',
        }),
      ).to.be.true;
    });
  });

  context('connected component', () => {
    it('renders via the default connected export', () => {
      const notification = makeNotification();
      const store = {
        getState: () => ({}),
        subscribe: sandbox.spy(),
        dispatch: sandbox.spy(),
      };

      const { getByTestId } = render(
        <Provider store={store}>
          <DebtNotificationAlertConnected notification={notification} />
        </Provider>,
      );

      expect(getByTestId('dashboard-notification-alert')).to.exist;
    });
  });
});
