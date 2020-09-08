import React from 'react';
import { Route } from 'react-router-dom';
import { expect } from 'chai';
import {
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/dom';
import { cleanup } from '@testing-library/react';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

import { getClinicMock, getAppointmentSlotMock } from '../mocks/v0';
import { createTestStore, renderWithStoreAndRouter } from '../mocks/setup';
import {
  mockEligibilityFetches,
  mockAppointmentSlotFetch,
} from '../mocks/helpers';

import TypeOfCarePage from '../../containers/TypeOfCarePage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCommunityCare: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe.only('VAOS integration: type of care pages', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());
  it('should show type of care page with all care types', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    expect(screen.getAllByRole('radio').length).to.equal(11);
    fireEvent.click(await screen.findByLabelText(/primary care/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-appointment/va-facility',
      ),
    );
  });
  it('should show type of care page without podiatry when CC flag is off', () => {
    const store = createTestStore({
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingCommunityCare: false,
      },
    });
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    expect(screen.getAllByRole('radio').length).to.equal(10);
  });
  it('should not allow users who are not CC eligible to use Podiatry', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    fireEvent.click(await screen.findByLabelText(/podiatry/i));
    fireEvent.click(screen.getByText(/Continue/));
    const unavailableWarning = await screen.findByText(
      /podiatry appointments can only be scheduled online for community care/i,
    );
    fireEvent.click(screen.getByText('Ok'));
    await waitForElementToBeRemoved(unavailableWarning);
  });
  it('should show eye care type of care page', () => {});
  it('should show audiology type of care page', () => {});
  it('should show sleep medicine type of care page', () => {});
  it('should open facility type page when CC eligible', () => {});
  it('should show update address modal when no address', () => {});
});
