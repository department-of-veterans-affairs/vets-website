/* eslint-disable camelcase */
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import DowntimeBanners from '../../../authentication/components/DowntimeBanner';

const mockStore = configureStore([thunk]);

describe('DowntimeBanners', () => {
  it('does not render component when page is loading', () => {
    const store = mockStore({
      externalServiceStatuses: {
        loading: true,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DowntimeBanners />
      </Provider>,
    );

    expect(container.querySelector('.downtime-notification')).to.be.null;
  });

  it('renders component with down status', () => {
    const store = mockStore({
      externalServiceStatuses: {
        loading: false,
        statuses: [{ service: 'mvi', serviceId: 'mvi', status: 'down' }],
        maintenanceWindows: [],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DowntimeBanners />
      </Provider>,
    );

    expect(container.querySelector('.downtime-notification')).to.exist;
    expect(container.querySelector('.form-warning-banner')).to.exist;
  });

  it('renders component with maintenance status', () => {
    const store = mockStore({
      externalServiceStatuses: {
        loading: false,
        statuses: [],
        maintenanceWindows: [
          {
            external_service: 'mvi',
            start_time: new Date(),
            end_time: new Date(),
          },
        ],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DowntimeBanners />
      </Provider>,
    );

    // Add assertions
    expect(container.querySelector('.downtime-notification')).to.exist;
    expect(container.querySelector('.form-warning-banner')).to.exist;
  });

  it('renders component with multiple statuses', () => {
    const store = mockStore({
      externalServiceStatuses: {
        loading: false,
        statuses: [
          { service: 'mvi', serviceId: 'mvi', status: 'down' },
          { service: 'other', serviceId: 'other', status: 'down' },
        ],
        maintenanceWindows: [],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DowntimeBanners />
      </Provider>,
    );

    expect(container.querySelector('.downtime-notification')).to.exist;
    expect(container.querySelectorAll('.form-warning-banner')).to.have.lengthOf(
      2,
    );
  });

  it('renders component with multiple statuses & windows ', () => {
    const st = new Date();
    const store = mockStore({
      externalServiceStatuses: {
        loading: false,
        statuses: [
          { service: 'mvi', serviceId: 'mvi', status: 'down' },
          { service: 'idme', serviceId: 'idme', status: 'down' },
        ],
        maintenanceWindows: [
          {
            external_service: 'logingov',
            start_time: new Date(),
            end_time: st.getTime() + 60 * 60 * 1000,
          },
        ],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DowntimeBanners />
      </Provider>,
    );

    expect(container.querySelector('.downtime-notification')).to.exist;
    expect(container.querySelectorAll('.form-warning-banner')).to.have.lengthOf(
      3,
    );
  });
});
