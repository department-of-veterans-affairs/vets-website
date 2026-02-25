import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import OHSyncStatusAlert from '../../../components/shared/OHSyncStatusAlert';

const mockStore = configureMockStore();

describe('OHSyncStatusAlert', () => {
  const createStore = ohSyncStatus => {
    return mockStore({
      sm: {
        ohSyncStatus,
      },
    });
  };

  it('should not render when status is FINISHED', () => {
    const store = createStore({
      data: {
        status: 'FINISHED',
        syncComplete: true,
        error: null,
      },
      error: undefined,
    });

    const { container } = render(
      <Provider store={store}>
        <OHSyncStatusAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.not.exist;
  });

  it('should render when status is IN_PROGRESS', () => {
    const store = createStore({
      data: {
        status: 'IN_PROGRESS',
        syncComplete: false,
        error: null,
      },
      error: undefined,
    });

    const { container } = render(
      <Provider store={store}>
        <OHSyncStatusAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('warning');
    expect(alert.hasAttribute('closeable')).to.be.true;
    expect(alert.getAttribute('close-btn-aria-label')).to.equal(
      'Close sync status notification',
    );
  });

  it('should render when status is STARTED', () => {
    const store = createStore({
      data: {
        status: 'STARTED',
        syncComplete: false,
        error: null,
      },
      error: undefined,
    });

    const { container } = render(
      <Provider store={store}>
        <OHSyncStatusAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
  });

  it('should render when status is NOT_STARTED', () => {
    const store = createStore({
      data: {
        status: 'NOT_STARTED',
        syncComplete: true,
        error: null,
      },
      error: undefined,
    });

    const { container } = render(
      <Provider store={store}>
        <OHSyncStatusAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
  });

  it('should not render when there is an error fetching status', () => {
    const store = createStore({
      data: null,
      error: true,
    });

    const { container } = render(
      <Provider store={store}>
        <OHSyncStatusAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.not.exist;
  });

  it('should not render when data is null', () => {
    const store = createStore({
      data: null,
      error: undefined,
    });

    const { container } = render(
      <Provider store={store}>
        <OHSyncStatusAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.not.exist;
  });

  it('should render when status is ERROR', () => {
    const store = createStore({
      data: {
        status: 'ERROR',
        syncComplete: false,
        error: 'Sync error occurred',
      },
      error: undefined,
    });

    const { container } = render(
      <Provider store={store}>
        <OHSyncStatusAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
  });

  it('should display correct heading and message', () => {
    const store = createStore({
      data: {
        status: 'IN_PROGRESS',
        syncComplete: false,
        error: null,
      },
      error: undefined,
    });

    const { container } = render(
      <Provider store={store}>
        <OHSyncStatusAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    const headline = alert.querySelector('h2[slot="headline"]');
    expect(headline.textContent).to.equal(
      "We're still adding some of your messages here",
    );

    const message = alert.querySelector('p');
    expect(message.textContent).to.equal(
      "We're working to add all of your messages to your inbox. They should be available soon.",
    );
  });
});
