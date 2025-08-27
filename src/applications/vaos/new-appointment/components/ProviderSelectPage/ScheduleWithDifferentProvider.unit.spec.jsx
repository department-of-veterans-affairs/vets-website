import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import ScheduleWithDifferentProvider from './ScheduleWithDifferentProvider';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';

const defaultState = {
  featureToggles: {
    vaOnlineSchedulingOhDirectSchedule: true,
    vaOnlineSchedulingOhRequest: true,
  },
};

describe('ScheduleWithDifferentProvider', () => {
  it('should display both options when user is eligible', () => {
    const store = createTestStore(defaultState);
    const eligibility = { request: true, requestReasons: [] };
    const selectedFacility = {
      id: '692',
      name: 'White City VA Medical Center',
    };

    const screen = renderWithStoreAndRouter(
      <ScheduleWithDifferentProvider
        eligibility={eligibility}
        selectedFacility={selectedFacility}
      />,
      { store },
    );

    expect(screen.getByText(/Option 1: Call the facility/i)).to.exist;
    expect(
      screen.getByText(
        /Option 2: Request your preferred date and time online/i,
      ),
    ).to.exist;

    // Use getByTestId to find the va-link component
    expect(screen.getByTestId('request-appointment-link')).to.exist;
  });

  it('should only display Call and ask to schedule with provider option when over request limit', () => {
    const store = createTestStore(defaultState);
    const eligibility = {
      requestReasons: ['overRequestLimit'],
    };
    const selectedFacility = {
      id: '692',
      name: 'White City VA Medical Center',
    };

    const screen = renderWithStoreAndRouter(
      <ScheduleWithDifferentProvider
        eligibility={eligibility}
        selectedFacility={selectedFacility}
      />,
      { store },
    );

    expect(screen.getByText(/Call and ask to schedule with that provider/i)).to
      .exist;
    expect(screen.queryByText(/Option 1: Call the facility/i)).to.not.exist;
    expect(
      screen.queryByText(
        /Option 2: Request your preferred date and time online/i,
      ),
    ).to.not.exist;
    expect(screen.queryByText(/Request an appointment/i)).to.not.exist;
  });
  // currently using both facility configurations and eligibility endpoints as source of truth for request eligibility
  // TODO: once we switch to using only eligibility endpoint, we can remove this test
  it('should only display Call and ask to schedule with provider option when patient is not eligible for requests', () => {
    const store = createTestStore(defaultState);
    const eligibility = {
      request: false,
      requestReasons: ['overRequestLimit'],
    };
    const selectedFacility = {
      id: '692',
      name: 'White City VA Medical Center',
    };

    const screen = renderWithStoreAndRouter(
      <ScheduleWithDifferentProvider
        eligibility={eligibility}
        selectedFacility={selectedFacility}
      />,
      { store },
    );

    expect(screen.getByText(/Call and ask to schedule with that provider/i)).to
      .exist;
    expect(screen.queryByText(/Option 1: Call the facility/i)).to.not.exist;
    expect(
      screen.queryByText(
        /Option 2: Request your preferred date and time online/i,
      ),
    ).to.not.exist;
    expect(screen.queryByText(/Request an appointment/i)).to.not.exist;
  });

  it('should render correct facility phone number', () => {
    const store = createTestStore(defaultState);
    const eligibility = { request: true, requestReasons: [] };
    const selectedFacility = {
      id: '692',
      name: 'White City VA Medical Center',
      telecom: [
        {
          system: 'phone',
          value: '541-123-4567',
        },
      ],
    };

    const screen = renderWithStoreAndRouter(
      <ScheduleWithDifferentProvider
        eligibility={eligibility}
        selectedFacility={selectedFacility}
      />,
      { store },
    );

    const phoneEl = screen.getByTestId('facility-telephone');
    expect(phoneEl).to.exist;
    expect(phoneEl.getAttribute('contact')).to.equal('541-123-4567');

    const ttyEl = screen.getByTestId('tty-telephone');
    expect(ttyEl.getAttribute('contact')).to.equal('711');
  });
  it('should route to request appointment URL when link clicked', async () => {
    const store = createTestStore(defaultState);
    const eligibility = { request: true, requestReasons: [] };
    const selectedFacility = {
      id: '692',
      name: 'White City VA Medical Center',
    };

    // Spy on dispatch to ensure our routing action is dispatched
    const dispatchSpy = sinon.spy(store, 'dispatch');

    const screen = renderWithStoreAndRouter(
      <ScheduleWithDifferentProvider
        eligibility={eligibility}
        selectedFacility={selectedFacility}
        pageKey="providerSelection"
      />,
      { store },
    );

    const link = screen.getByTestId('request-appointment-link');
    expect(link).to.exist;

    await userEvent.click(link);

    // Assert dispatch was called (routing action dispatched)
    expect(dispatchSpy.called).to.be.true;

    // If renderWithStoreAndRouter returns history, assert path
    if (screen.history) {
      expect(screen.history.location.pathname).to.equal('/va-request/');
    }

    dispatchSpy.restore();
  });
});
