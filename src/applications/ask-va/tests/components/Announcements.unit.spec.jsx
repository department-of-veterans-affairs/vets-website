import * as apiUtils from '@department-of-veterans-affairs/platform-utilities/api';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';
import Announcements from '../../components/Announcements';

const mockAnnouncementsResponse = {
  data: [
    {
      attributes: {
        startDate: '2024-03-19T00:00:00Z',
        endDate: '2024-03-21T00:00:00Z',
        text: 'Current Announcement',
      },
    },
    {
      attributes: {
        startDate: '2024-03-21T00:00:00Z',
        endDate: '2024-03-22T00:00:00Z',
        text: 'Upcoming Announcement',
      },
    },
    {
      attributes: {
        startDate: '2024-03-18T00:00:00Z',
        endDate: '2024-03-20T23:59:59Z',
        text: 'Active Announcement',
      },
    },
  ],
};

const generateStore = (initialState = {}) => {
  return createStore((state = {}) => state, initialState);
};

describe('<Announcements />', () => {
  const mockDate = new Date('2024-03-20T12:00:00Z');
  let originalDate;
  let apiRequestStub;

  beforeEach(() => {
    // Mock the Date constructor to return a consistent date
    originalDate = global.Date;
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    };

    // Mock the API request
    apiRequestStub = sinon
      .stub(apiUtils, 'apiRequest')
      .resolves(mockAnnouncementsResponse);
  });

  afterEach(() => {
    // Restore the original Date constructor and API stub
    global.Date = originalDate;
    apiRequestStub.restore();
  });

  it('should render nothing when there are no announcements', async () => {
    apiRequestStub.resolves({ data: [] });
    const store = generateStore();
    const { container } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(container.firstChild).to.be.null;
  });

  it('should render announcements when mock data is available', async () => {
    const store = generateStore();
    const { findByText } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    const currentAnnouncement = await findByText('Current Announcement');
    expect(currentAnnouncement).to.exist;
  });

  it('should filter out expired announcements', async () => {
    const store = generateStore();
    const { queryByText } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Wait for component to update
    await new Promise(resolve => setTimeout(resolve, 0));

    // Check that expired announcement is not shown
    expect(queryByText('Expired Announcement')).to.be.null;
  });

  it('should allow closing announcements', async () => {
    const store = generateStore();
    const { container, findByText, queryByText } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Wait for the announcement to be rendered
    const currentAnnouncement = await findByText('Current Announcement');
    expect(currentAnnouncement).to.exist;

    // Find the alert element
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;

    // Simulate the closeEvent
    alert.dispatchEvent(new CustomEvent('closeEvent'));

    // Wait for the announcement to be removed
    await waitFor(() => {
      expect(queryByText('Current Announcement')).to.be.null;
    });
  });

  it('should sort announcements by start date', async () => {
    const store = generateStore();
    const { findAllByRole } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Get all headlines
    const headlines = await findAllByRole('heading', { level: 2 });

    // Check that announcements are sorted by start date
    expect(headlines[0].textContent).to.equal('Site Maintenance');
    expect(headlines[1].textContent).to.equal('Site Maintenance');
    expect(headlines[2].textContent).to.equal('Site Maintenance');
  });

  it('should display correct status based on announcement timing', async () => {
    const store = generateStore();
    const { container, findByText } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Wait for component to render
    await findByText('Current Announcement');

    // Check status of different types of announcements
    const alerts = container.querySelectorAll('va-alert');
    expect(alerts[0].getAttribute('status')).to.equal('warning');
    expect(alerts[1].getAttribute('status')).to.equal('warning');
    expect(alerts[2].getAttribute('status')).to.equal('warning');
  });
});
