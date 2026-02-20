import React from 'react';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';

import TestNotificationConnected, {
  TestNotification,
} from '../../../components/notifications/TestNotification';

const makeNotification = (overrides = {}) => ({
  id: '12345',
  type: 'onsite_notification',
  attributes: {
    createdAt: '2024-06-15T14:30:00Z',
    dismissed: false,
    templateId: 'template-001',
    vaProfileId: '99',
    ...overrides,
  },
});

describe('<TestNotification />', () => {
  let sandbox;
  let dismissNotificationSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dismissNotificationSpy = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders the notification card', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <TestNotification
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    expect(getByTestId('onsite-notification-card')).to.exist;
  });

  it('renders inside a DashboardWidgetWrapper', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <TestNotification
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    expect(getByTestId('dashboard-widget-wrapper')).to.exist;
  });

  it('formats and displays the createdAt date', () => {
    const notification = makeNotification({
      createdAt: '2024-06-15T14:30:00Z',
    });
    const { getByTestId } = render(
      <TestNotification
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const card = getByTestId('onsite-notification-card');
    expect(card.getAttribute('date-time')).to.equal('Saturday, Jun 15, 2024');
  });

  it('sets the headline to "You have new debt."', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <TestNotification
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const card = getByTestId('onsite-notification-card');
    expect(card.getAttribute('headline')).to.equal('You have new debt.');
  });

  it('sets the headline-level to "3"', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <TestNotification
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const card = getByTestId('onsite-notification-card');
    expect(card.getAttribute('headline-level')).to.equal('3');
  });

  it('sets the href to the debt summary page', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <TestNotification
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const card = getByTestId('onsite-notification-card');
    expect(card.getAttribute('href')).to.equal(
      '/manage-va-debt/summary/debt-balances',
    );
  });

  it('sets the text to "Manage your VA debt"', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <TestNotification
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const card = getByTestId('onsite-notification-card');
    expect(card.getAttribute('text')).to.equal('Manage your VA debt');
  });

  it('sets the symbol to "action-required"', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <TestNotification
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const card = getByTestId('onsite-notification-card');
    expect(card.getAttribute('symbol')).to.equal('action-required');
  });

  it('sets closeBtnAriaLabel to "Close notification"', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <TestNotification
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const card = getByTestId('onsite-notification-card');
    expect(card.getAttribute('close-btn-aria-label')).to.equal(
      'Close notification',
    );
  });

  it('is visible by default', () => {
    const notification = makeNotification();
    const { getByTestId } = render(
      <TestNotification
        notification={notification}
        dismissNotification={dismissNotificationSpy}
      />,
    );

    const card = getByTestId('onsite-notification-card');
    expect(card.getAttribute('visible')).to.not.equal('false');
  });

  context('closeNotification', () => {
    it('calls dismissNotification with the notification id on close event', () => {
      const notification = makeNotification();
      const { getByTestId } = render(
        <TestNotification
          notification={notification}
          dismissNotification={dismissNotificationSpy}
        />,
      );

      const card = getByTestId('onsite-notification-card');
      // Simulate the onCloseEvent from the web component
      const closeEvent = new CustomEvent('closeEvent');
      card.dispatchEvent(closeEvent);
      fireEvent(card, closeEvent);

      expect(dismissNotificationSpy.calledWith('12345')).to.be.true;
    });

    it('hides the notification after close', () => {
      const notification = makeNotification();
      const { getByTestId } = render(
        <TestNotification
          notification={notification}
          dismissNotification={dismissNotificationSpy}
        />,
      );

      const card = getByTestId('onsite-notification-card');
      const closeEvent = new CustomEvent('closeEvent');
      fireEvent(card, closeEvent);

      expect(card.getAttribute('visible')).to.equal('false');
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
          <TestNotificationConnected notification={notification} />
        </Provider>,
      );

      expect(getByTestId('onsite-notification-card')).to.exist;
    });
  });
});
