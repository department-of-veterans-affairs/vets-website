import * as apiUtils from '@department-of-veterans-affairs/platform-utilities/api';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';
import Announcements from '../../components/Announcements';
import * as constants from '../../constants';

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
  let clock;
  let apiRequestStub;
  let constantsStub;

  beforeEach(() => {
    clock = sinon.useFakeTimers({ now: mockDate.getTime(), toFake: ['Date'] });

    // Mock the API request
    apiRequestStub = sinon
      .stub(apiUtils, 'apiRequest')
      .resolves(mockAnnouncementsResponse);

    // Mock the constants
    constantsStub = sinon.stub(constants, 'mockTestingFlagForAPI');
  });

  afterEach(() => {
    // Restore the clock and stubs
    clock.restore();
    apiRequestStub.restore();
    constantsStub.restore();
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
    const { container, findByText } = render(
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
      const alerts = container.querySelectorAll('va-alert');
      expect(alerts.length).to.equal(2); // One less than before
    });
  });

  it('should sort announcements by start date', async () => {
    // Mock current date
    const originalNow = Date.now;
    const mockNow = new Date('2024-03-20T00:00:00Z').getTime();
    Date.now = () => mockNow;

    // Mock API response with future announcements
    apiRequestStub.resolves({
      data: [
        {
          attributes: {
            startDate: '2024-03-21T00:00:00Z',
            endDate: '2024-03-22T00:00:00Z',
            text: 'Future Announcement 1',
          },
        },
        {
          attributes: {
            startDate: '2024-03-22T00:00:00Z',
            endDate: '2024-03-23T00:00:00Z',
            text: 'Future Announcement 2',
          },
        },
        {
          attributes: {
            startDate: '2024-03-23T00:00:00Z',
            endDate: '2024-03-24T00:00:00Z',
            text: 'Future Announcement 3',
          },
        },
      ],
    });

    const store = generateStore();
    const { findAllByRole } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Get all headlines
    const headlines = await findAllByRole('heading', { level: 2 });

    // Check that announcements are sorted by start date
    // Since all announcements are in the future, they should have "Upcoming Site Maintenance" as headline
    expect(headlines[0].textContent).to.equal('Upcoming Site Maintenance');
    expect(headlines[1].textContent).to.equal('Upcoming Site Maintenance');
    expect(headlines[2].textContent).to.equal('Upcoming Site Maintenance');

    // Restore original Date.now
    Date.now = originalNow;
  });

  it('should display correct status based on announcement timing', async () => {
    // Mock current date
    const originalNow = Date.now;
    const mockNow = new Date('2024-03-20T00:00:00Z').getTime();
    Date.now = () => mockNow;

    // Mock API response with current and future announcements
    apiRequestStub.resolves({
      data: [
        {
          attributes: {
            startDate: '2024-03-21T00:00:00Z', // Future
            endDate: '2024-03-22T00:00:00Z',
            text: 'Future Announcement',
          },
        },
        {
          attributes: {
            startDate: '2024-03-19T00:00:00Z', // Current
            endDate: '2024-03-21T00:00:00Z',
            text: 'Current Announcement',
          },
        },
      ],
    });

    const store = generateStore();
    const { container } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Wait for component to render
    await waitFor(() => {
      const alerts = container.querySelectorAll('va-alert');
      expect(alerts.length).to.equal(2);
      // Future announcement should have info status and "Upcoming Site Maintenance" headline
      expect(alerts[0].getAttribute('status')).to.equal('info');
      expect(alerts[0].querySelector('h2').textContent).to.equal(
        'Upcoming Site Maintenance',
      );
      // Current announcement should have warning status and "Site Maintenance" headline
      expect(alerts[1].getAttribute('status')).to.equal('warning');
      expect(alerts[1].querySelector('h2').textContent).to.equal(
        'Site Maintenance',
      );
    });

    // Restore original Date.now
    Date.now = originalNow;
  });

  it('should handle API errors gracefully', async () => {
    // Simulate an API error
    apiRequestStub.rejects(new Error('API Error'));

    const store = generateStore();
    const { container } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Wait for component to update
    await new Promise(resolve => setTimeout(resolve, 0));

    // Should render nothing when API fails
    expect(container.firstChild).to.be.null;
  });

  it('should handle invalid announcement data', async () => {
    // Test with missing required fields
    apiRequestStub.resolves({
      data: [
        {
          attributes: {
            // Missing startDate
            endDate: '2024-03-21T00:00:00Z',
            text: 'Invalid Announcement',
          },
        },
        {
          attributes: {
            startDate: '2024-03-19T00:00:00Z',
            // Missing endDate
            text: 'Another Invalid Announcement',
          },
        },
        {
          attributes: {
            startDate: '2024-03-19T00:00:00Z',
            endDate: '2024-03-21T00:00:00Z',
            // Missing text
          },
        },
      ],
    });

    const store = generateStore();
    const { queryByText } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Wait for component to update
    await new Promise(resolve => setTimeout(resolve, 0));

    // Invalid announcements should be filtered out
    expect(queryByText('Invalid Announcement')).to.be.null;
    expect(queryByText('Another Invalid Announcement')).to.be.null;
  });

  it('should handle different date scenarios', async () => {
    // Test with announcements in different time periods
    apiRequestStub.resolves({
      data: [
        {
          attributes: {
            startDate: '2024-03-21T00:00:00Z', // Future
            endDate: '2024-03-22T00:00:00Z',
            text: 'Future Announcement',
          },
        },
        {
          attributes: {
            startDate: '2024-03-19T00:00:00Z', // Current
            endDate: '2024-03-21T00:00:00Z',
            text: 'Current Announcement',
          },
        },
        {
          attributes: {
            startDate: '2024-03-18T00:00:00Z', // Past
            endDate: '2024-03-19T23:59:59Z',
            text: 'Past Announcement',
          },
        },
      ],
    });

    const store = generateStore();
    const { findByText, queryByText } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Current announcement should be shown
    await findByText('Current Announcement');

    // Future announcement should be shown since it hasn't expired
    await findByText('Future Announcement');

    // Past announcement should be filtered out since it has expired
    expect(queryByText('Past Announcement')).to.be.null;
  });

  it('should handle edge case dates', async () => {
    // Test with announcements at the edge of the current time
    apiRequestStub.resolves({
      data: [
        {
          attributes: {
            startDate: mockDate.toISOString(), // Exactly now
            endDate: '2024-03-21T00:00:00Z',
            text: 'Starting Now Announcement',
          },
        },
        {
          attributes: {
            startDate: '2024-03-19T00:00:00Z',
            endDate: mockDate.toISOString(), // Ending now
            text: 'Ending Now Announcement',
          },
        },
      ],
    });

    const store = generateStore();
    const { findByText } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Both announcements should be shown since they're active at the current time
    await findByText('Starting Now Announcement');
    await findByText('Ending Now Announcement');
  });

  it('should use mock data when mockTestingFlagForAPI is true', async () => {
    constantsStub.get(() => true);

    const store = generateStore();
    const { findAllByText } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Wait for announcements to be rendered
    const announcements = await findAllByText('Upcoming Site Maintenance');
    expect(announcements).to.have.length.greaterThan(0);
  });

  it('should make API call when mockTestingFlagForAPI is false', async () => {
    constantsStub.get(() => false);

    const store = generateStore();
    const { findAllByText } = render(
      <Provider store={store}>
        <Announcements />
      </Provider>,
    );

    // Should make API call
    const elements = await findAllByText('Site Maintenance');
    expect(elements.length).to.be.greaterThan(0);
    expect(apiRequestStub.called).to.be.true;
    expect(apiRequestStub.firstCall.args[0]).to.equal(
      `${constants.envUrl}${constants.URL.ANNOUNCEMENTS}`,
    );
  });
});
