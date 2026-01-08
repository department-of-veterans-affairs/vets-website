import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';

import Verify from './Verify';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

// Helper component to display current location for testing navigation
const LocationDisplay = () => {
  const location = useLocation();
  return (
    <div data-testid="location-display">
      {location.pathname}
      {location.search}
    </div>
  );
};

const defaultRenderOptions = {
  initialState: {
    vassForm: {
      hydrated: false,
      selectedDate: null,
      selectedTopics: [],
    },
  },
  reducers,
  additionalMiddlewares: [vassApi.middleware],
};

describe('VASS Component: Verify', () => {
  it('should render all content', () => {
    const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
      <Verify />,
      defaultRenderOptions,
    );

    expect(getByTestId('header')).to.exist;
    expect(getByTestId('verify-intro-text')).to.exist;
    expect(getByTestId('last-name-input')).to.exist;
    expect(getByTestId('dob-input')).to.exist;
    expect(getByTestId('submit-button')).to.exist;
    expect(queryByTestId('verify-error-alert')).to.not.exist;
  });

  it('should display error alert when submitting with incorrect credentials', async () => {
    const {
      getByTestId,
      queryByTestId,
      container,
    } = renderWithStoreAndRouterV6(<Verify />, defaultRenderOptions);

    const submitButton = getByTestId('submit-button');

    const dobInput = container.querySelector(
      'va-memorable-date[data-testid="dob-input"]',
    );
    dobInput.__events.dateChange({ target: { value: '1990-01-01' } });

    inputVaTextInput(
      container,
      'WrongName',
      'va-text-input[data-testid="last-name-input"]',
    );

    submitButton.click();

    await waitFor(() => {
      expect(queryByTestId('verify-error-alert')).to.exist;
    });
  });

  describe('when cancellation url parameter is true', () => {
    it('should display the correct page title', () => {
      const { getByTestId } = renderWithStoreAndRouterV6(<Verify />, {
        ...defaultRenderOptions,
        initialEntries: ['/verify?cancel=true'],
      });

      expect(getByTestId('header').textContent).to.contain(
        'Cancel VA Solid Start appointment',
      );
    });

    it('should navigate to enter otc page passing cancel=true as a url parameter', async () => {
      const { container, getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/verify" element={<Verify />} />
            <Route path="/enter-otc" element={<div>Enter OTC Page</div>} />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: ['/verify?cancel=true'],
        },
      );

      // Fill in valid credentials
      inputVaTextInput(
        container,
        'Smith',
        'va-text-input[data-testid="last-name-input"]',
      );
      const dobInput = container.querySelector(
        'va-memorable-date[data-testid="dob-input"]',
      );
      dobInput.__events.dateChange({ target: { value: '1935-04-07' } });

      const submitButton = getByTestId('submit-button');
      submitButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          '/enter-otc?cancel=true',
        );
      });
    });
  });

  describe('successful verification navigation', () => {
    it('should navigate to enter-otc page with valid credentials', async () => {
      const { container, getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/verify" element={<Verify />} />
            <Route path="/enter-otc" element={<div>Enter OTC Page</div>} />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: ['/verify'],
        },
      );

      // Fill in valid credentials
      inputVaTextInput(
        container,
        'Smith',
        'va-text-input[data-testid="last-name-input"]',
      );
      const dobInput = container.querySelector(
        'va-memorable-date[data-testid="dob-input"]',
      );
      dobInput.__events.dateChange({ target: { value: '1935-04-07' } });

      const submitButton = getByTestId('submit-button');
      submitButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          '/enter-otc',
        );
      });
    });
  });
});
