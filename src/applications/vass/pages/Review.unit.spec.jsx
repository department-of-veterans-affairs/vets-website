import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 } from 'platform/testing/unit/react-testing-library-helpers';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import Review from './Review';
import { getDefaultRenderOptions, LocationDisplay } from '../utils/test-utils';
import { URLS } from '../utils/constants';
import {
  createAppointmentSaveFailedError,
  createServiceError,
} from '../services/mocks/utils/errors';

const defaultFormState = {
  hydrated: true,
  selectedDate: '2025-01-15T10:00:00.000Z',
  selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
  uuid: 'c0ffee-1234-beef-5678',
  lastname: 'Smith',
  dob: '1935-04-07',
  obfuscatedEmail: 's****@email.com',
};

const appointmentId = 'appt-123456';

// TODO: Add mock appointment success response to fixtures
const mockAppointmentSuccessResponse = {
  data: {
    appointmentId,
  },
};

const defaultRenderOptions = getDefaultRenderOptions(defaultFormState);

const renderComponent = () =>
  renderWithStoreAndRouterV6(<Review />, defaultRenderOptions);

describe('VASS Component: Review', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('should render review page correctly', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('review-page')).to.exist;
    expect(getByTestId('back-link')).to.exist;
    expect(getByTestId('header')).to.exist;
    expect(getByTestId('header').textContent).to.contain(
      'Review your VA Solid Start appointment details',
    );
    expect(getByTestId('date-time-title')).to.exist;
    expect(getByTestId('date-time-edit-link')).to.exist;
    expect(getByTestId('date-time-description')).to.exist;
    expect(getByTestId('topic-title')).to.exist;
    expect(getByTestId('topic-edit-link')).to.exist;
    expect(getByTestId('topic-description')).to.exist;
    expect(getByTestId('confirm-call-button')).to.exist;
  });

  it('should display single topic correctly', () => {
    const { getByTestId } = renderWithStoreAndRouterV6(
      <Review />,
      getDefaultRenderOptions({
        ...defaultFormState,
        selectedTopics: [{ topicId: '1', topicName: 'Education Benefits' }],
      }),
    );

    expect(getByTestId('topic-description').textContent).to.equal(
      'Education Benefits',
    );
  });

  it('should display multiple topics as comma-separated list', () => {
    const { getByTestId } = renderWithStoreAndRouterV6(
      <Review />,
      getDefaultRenderOptions({
        ...defaultFormState,
        selectedTopics: [
          { topicId: '1', topicName: 'Education Benefits' },
          { topicId: '2', topicName: 'Health Care' },
          { topicId: '3', topicName: 'Housing Assistance' },
        ],
      }),
    );

    expect(getByTestId('topic-description').textContent).to.equal(
      'Education Benefits, Health Care, Housing Assistance',
    );
  });

  it('should have edit links pointing to correct routes', () => {
    const { getByTestId } = renderComponent();

    const dateTimeEditLink = getByTestId('date-time-edit-link');
    const topicEditLink = getByTestId('topic-edit-link');

    expect(dateTimeEditLink.getAttribute('href')).to.equal(URLS.DATE_TIME);
    expect(topicEditLink.getAttribute('href')).to.equal(URLS.TOPIC_SELECTION);
  });

  describe('successful appointment submission', () => {
    it('should navigate to confirmation page on successful submission', async () => {
      setFetchJSONResponse(
        global.fetch.onCall(0),
        mockAppointmentSuccessResponse,
      );

      const { getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path={URLS.REVIEW} element={<Review />} />
            <Route
              path={`${URLS.CONFIRMATION}/:appointmentId`}
              element={<div>Confirmation Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: [URLS.REVIEW],
        },
      );

      const confirmButton = getByTestId('confirm-call-button');
      confirmButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          `${URLS.CONFIRMATION}/${appointmentId}`,
        );
      });
    });
  });

  describe('API error handling', () => {
    it('should not navigate when API returns an error', async () => {
      setFetchJSONFailure(
        global.fetch.onCall(0),
        createAppointmentSaveFailedError(),
      );

      const { getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path={URLS.REVIEW} element={<Review />} />
            <Route
              path={`${URLS.CONFIRMATION}/:appointmentId`}
              element={<div>Confirmation Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: [URLS.REVIEW],
        },
      );

      const confirmButton = getByTestId('confirm-call-button');
      confirmButton.click();

      await waitFor(() => {
        // Should still be on review page
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.REVIEW,
        );
      });
    });

    it('should display error alert when server error occurs', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), createServiceError());

      const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path={URLS.REVIEW} element={<Review />} />
          </Routes>
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: [URLS.REVIEW],
        },
      );

      const confirmButton = getByTestId('confirm-call-button');
      confirmButton.click();

      await waitFor(() => {
        expect(getByTestId('api-error-alert')).to.exist;
        expect(queryByTestId('back-link')).to.not.exist;
        expect(queryByTestId('header')).to.not.exist;
      });
    });
  });
});
