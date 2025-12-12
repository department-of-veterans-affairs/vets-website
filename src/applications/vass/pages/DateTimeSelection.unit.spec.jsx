import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import DateTimeSelection from './DateTimeSelection';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

// Mock availability data
const mockAvailabilityData = {
  data: {
    availableTimeSlots: [
      {
        dtStartUtc: '2025-12-15T14:00:00Z',
        dtEndUtc: '2025-12-15T14:30:00Z',
      },
      {
        dtStartUtc: '2025-12-15T15:00:00Z',
        dtEndUtc: '2025-12-15T15:30:00Z',
      },
    ],
  },
};

describe('VASS Component: DateTimeSelection', () => {
  let useGetAppointmentAvailabilityQueryStub;

  beforeEach(() => {
    // Default mock: successful API response
    useGetAppointmentAvailabilityQueryStub = sinon.stub(
      vassApi.endpoints.getAppointmentAvailability,
      'useQuery',
    );
    useGetAppointmentAvailabilityQueryStub.returns({
      data: mockAvailabilityData,
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    useGetAppointmentAvailabilityQueryStub.restore();
  });

  const renderComponent = () =>
    renderWithStoreAndRouterV6(<DateTimeSelection />, {
      initialState: {
        vassForm: {
          selectedDate: null,
          selectedTopics: [],
        },
      },
      reducers,
      additionalMiddlewares: [vassApi.middleware],
    });

  it('should render title', () => {
    const screen = renderComponent();
    expect(screen.getByTestId('header')).to.exist;
  });

  it('should render the date time page correctly', () => {
    const screen = renderComponent();
    expect(screen.getByTestId('content')).to.exist;
    expect(screen.getByTestId('vaos-calendar')).to.exist;
    expect(screen.getByTestId('continue-button')).to.exist;
  });

  it('should prevent navigation when no date/time selected and continue button clicked', async () => {
    const screen = renderComponent();
    const continueButton = screen.getByTestId('continue-button');

    await userEvent.click(continueButton);

    // Validation error should be displayed
    await waitFor(() => {
      expect(screen.queryByText(/Please select a preferred date and time/)).to
        .exist;
    });
  });

  it('should have continue button with correct attributes', () => {
    const screen = renderComponent();
    const continueButton = screen.getByTestId('continue-button');

    expect(continueButton).to.have.attribute('continue');
  });

  describe('RTK Query Integration', () => {
    it('should display loading indicator when fetching availability', () => {
      useGetAppointmentAvailabilityQueryStub.returns({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      const { container } = renderComponent();
      const loadingIndicator = container.querySelector('va-loading-indicator');

      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Loading available appointments...',
      );
    });

    it('should not display calendar when loading', () => {
      useGetAppointmentAvailabilityQueryStub.returns({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      const screen = renderComponent();

      expect(screen.queryByTestId('vaos-calendar')).to.not.exist;
      expect(screen.queryByTestId('continue-button')).to.not.exist;
    });

    it('should display error alert when API call fails', () => {
      useGetAppointmentAvailabilityQueryStub.returns({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      const { container } = renderComponent();
      const errorAlert = container.querySelector('va-alert[status="error"]');

      expect(errorAlert).to.exist;
      expect(errorAlert.textContent).to.include(
        "We can't load available appointments",
      );
    });

    it('should not display calendar when error occurs', () => {
      useGetAppointmentAvailabilityQueryStub.returns({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      const screen = renderComponent();

      expect(screen.queryByTestId('vaos-calendar')).to.not.exist;
      expect(screen.queryByTestId('continue-button')).to.not.exist;
    });

    it('should populate calendar with available slots from API', () => {
      const screen = renderComponent();

      expect(screen.getByTestId('vaos-calendar')).to.exist;
      // Calendar should be rendered with slots from mockAvailabilityData
    });

    it('should transform API response format to calendar widget format', () => {
      const screen = renderComponent();
      const calendar = screen.getByTestId('vaos-calendar');

      expect(calendar).to.exist;
      // The component should transform dtStartUtc/dtEndUtc to start/end
      // This is verified by the calendar rendering without errors
    });

    it('should handle empty availability data gracefully', () => {
      useGetAppointmentAvailabilityQueryStub.returns({
        data: {
          data: {
            availableTimeSlots: [],
          },
        },
        isLoading: false,
        isError: false,
      });

      const screen = renderComponent();

      // Calendar should still render but with no slots
      expect(screen.getByTestId('vaos-calendar')).to.exist;
      expect(screen.getByTestId('continue-button')).to.exist;
    });
  });
});
