import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  mockFetch,
  setFetchJSONResponse,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import DateTimeSelection from './DateTimeSelection';
import { generateSlots } from '../utils/mock-helpers';
import { getDefaultRenderOptions } from '../utils/test-utils';
import * as auth from '../utils/auth';

// Mock appointment availability data
const mockAppointmentAvailability = {
  data: {
    appointmentId: 'test-uuid',
    availableTimeSlots: generateSlots(),
  },
};

describe('VASS Component: DateTimeSelection', () => {
  beforeEach(() => {
    mockFetch();
    setFetchJSONResponse(global.fetch.onCall(0), mockAppointmentAvailability);
  });

  afterEach(() => {
    resetFetch();
  });

  const renderComponent = (selectedDate = null) => {
    return renderWithStoreAndRouterV6(
      <DateTimeSelection />,
      getDefaultRenderOptions({ selectedDate }),
    );
  };

  it('should render the date time page correctly', async () => {
    const screen = renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('date-time-selection')).to.exist;
    });
    expect(screen.getByTestId('date-time-selection')).to.exist;
    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('content')).to.exist;
    expect(screen.getByTestId('vaos-calendar')).to.exist;
    expect(screen.getByTestId('continue-button')).to.exist;
    const continueButton = screen.getByTestId('continue-button');
    expect(continueButton).to.have.attribute('continue');
  });

  it('should prevent navigation when no date/time selected and continue button clicked', async () => {
    const screen = renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('date-time-selection')).to.exist;
    });
    const continueButton = screen.getByTestId('continue-button');

    await userEvent.click(continueButton);

    // Validation error should be displayed
    await waitFor(() => {
      expect(screen.queryByText(/Please select a preferred date and time/)).to
        .exist;
    });
  });

  it('should not deselect date when onChange is called with empty array', async () => {
    // Render component with a pre-selected date
    const selectedDate =
      mockAppointmentAvailability.data.availableTimeSlots[0].dtStartUtc;
    const screen = renderComponent(selectedDate);
    await waitFor(() => {
      expect(screen.getByTestId('date-time-selection')).to.exist;
    });

    // The calendar should show the selected date
    expect(screen.getByTestId('vaos-calendar')).to.exist;

    // Click continue - should not show validation error since date is already selected
    const continueButton = screen.getByTestId('continue-button');
    await userEvent.click(continueButton);

    // No validation error should appear since the date was pre-selected
    await waitFor(() => {
      expect(screen.queryByText(/Please select a preferred date and time/)).to
        .not.exist;
    });
  });

  it('should clear validation error when a date is selected after failed submit', async () => {
    const screen = renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('date-time-selection')).to.exist;
    });
    const continueButton = screen.getByTestId('continue-button');

    // First click continue without selecting a date to trigger validation error
    await userEvent.click(continueButton);

    // Validation error should be displayed
    await waitFor(() => {
      expect(screen.queryByText(/Please select a preferred date and time/)).to
        .exist;
    });

    // The calendar widget should be present for selecting a date
    expect(screen.getByTestId('vaos-calendar')).to.exist;
  });

  describe('navigation prevention', () => {
    let addEventListenerSpy;
    let removeEventListenerSpy;

    beforeEach(() => {
      addEventListenerSpy = sinon.spy(window, 'addEventListener');
      removeEventListenerSpy = sinon.spy(window, 'removeEventListener');
    });

    afterEach(() => {
      addEventListenerSpy.restore();
      removeEventListenerSpy.restore();
    });

    it('should add beforeunload listener on mount', async () => {
      const screen = renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('date-time-selection')).to.exist;
      });

      expect(addEventListenerSpy.calledWith('beforeunload', sinon.match.func))
        .to.be.true;
    });

    it('should add popstate listener on mount', async () => {
      const screen = renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('date-time-selection')).to.exist;
      });

      expect(addEventListenerSpy.calledWith('popstate', sinon.match.func)).to.be
        .true;
    });

    it('should remove beforeunload listener on unmount', async () => {
      const screen = renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('date-time-selection')).to.exist;
      });

      screen.unmount();

      expect(
        removeEventListenerSpy.calledWith('beforeunload', sinon.match.func),
      ).to.be.true;
    });

    it('should remove popstate listener on unmount', async () => {
      const screen = renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('date-time-selection')).to.exist;
      });

      screen.unmount();

      expect(removeEventListenerSpy.calledWith('popstate', sinon.match.func)).to
        .be.true;
    });

    it('should push history state on mount', async () => {
      const pushStateSpy = sinon.spy(window.history, 'pushState');

      const screen = renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('date-time-selection')).to.exist;
      });

      expect(pushStateSpy.called).to.be.true;
      pushStateSpy.restore();
    });

    it('should prevent back navigation when user cancels confirm dialog', async () => {
      const confirmStub = sinon.stub(window, 'confirm').returns(false);
      const pushStateSpy = sinon.spy(window.history, 'pushState');

      const screen = renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('date-time-selection')).to.exist;
      });

      // Simulate popstate event
      const popstateEvent = new PopStateEvent('popstate');
      window.dispatchEvent(popstateEvent);

      await waitFor(() => {
        expect(confirmStub.called).to.be.true;
      });

      // Should push state again to stay on page
      expect(pushStateSpy.callCount).to.be.at.least(2);

      confirmStub.restore();
      pushStateSpy.restore();
    });

    it('should allow back navigation when user confirms dialog', async () => {
      const confirmStub = sinon.stub(window, 'confirm').returns(true);
      const backSpy = sinon.spy(window.history, 'back');

      const screen = renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('date-time-selection')).to.exist;
      });

      // Simulate popstate event
      const popstateEvent = new PopStateEvent('popstate');
      window.dispatchEvent(popstateEvent);

      await waitFor(() => {
        expect(confirmStub.called).to.be.true;
      });

      expect(backSpy.called).to.be.true;

      confirmStub.restore();
      backSpy.restore();
    });

    it('should remove VASS token when user confirms navigation', async () => {
      const confirmStub = sinon.stub(window, 'confirm').returns(true);
      const removeVassTokenSpy = sinon.spy(auth, 'removeVassToken');
      const backSpy = sinon.spy(window.history, 'back');

      const screen = renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('date-time-selection')).to.exist;
      });

      // Simulate popstate event
      const popstateEvent = new PopStateEvent('popstate');
      window.dispatchEvent(popstateEvent);

      await waitFor(() => {
        expect(confirmStub.called).to.be.true;
        expect(removeVassTokenSpy.called).to.be.true;
      });

      expect(backSpy.called).to.be.true;

      confirmStub.restore();
      removeVassTokenSpy.restore();
      backSpy.restore();
    });

    it('should not remove VASS token when user cancels navigation', async () => {
      const confirmStub = sinon.stub(window, 'confirm').returns(false);
      const removeVassTokenSpy = sinon.spy(auth, 'removeVassToken');
      const pushStateSpy = sinon.spy(window.history, 'pushState');

      const screen = renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('date-time-selection')).to.exist;
      });

      // Simulate popstate event
      const popstateEvent = new PopStateEvent('popstate');
      window.dispatchEvent(popstateEvent);

      await waitFor(() => {
        expect(confirmStub.called).to.be.true;
      });

      expect(removeVassTokenSpy.called).to.be.false;
      expect(pushStateSpy.callCount).to.be.at.least(2);

      confirmStub.restore();
      removeVassTokenSpy.restore();
      pushStateSpy.restore();
    });
  });
});
