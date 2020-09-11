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

import {
  getClinicMock,
  getAppointmentSlotMock,
  getParentSiteMock,
} from '../mocks/v0';
import { createTestStore, renderWithStoreAndRouter } from '../mocks/setup';
import {
  mockEligibilityFetches,
  mockAppointmentSlotFetch,
  mockCommunityCareEligibility,
  mockParentSites,
} from '../mocks/helpers';

import TypeOfCarePage from '../../new-appointment/components/TypeOfCarePage';
import TypeOfEyeCarePage from '../../new-appointment/components/TypeOfEyeCarePage';

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
    await screen.findByText(
      /podiatry appointments can only be scheduled online for community care/i,
    );
    fireEvent.click(screen.getByText('Ok'));

    await waitFor(
      () => expect(screen.queryByText(/podiatry appointments/i)).not.to.exist,
    );
    expect(screen.getByText(/please choose a type of care/i)).to.exist;
  });
  it('should open facility type page when CC eligible and has a support parent site', async () => {
    const parentSite983 = {
      id: '983',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983',
        rootStationCode: '983',
        parentStationCode: '983',
      },
    };
    const parentSite983GC = {
      id: '983GC',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983GC',
        rootStationCode: '983',
        parentStationCode: '983GC',
      },
    };
    mockParentSites(['983'], [parentSite983, parentSite983GC]);
    mockCommunityCareEligibility({
      parentSites: ['983GC', '983'],
      supportedSites: ['983GC'],
      careType: 'PrimaryCare',
    });
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    fireEvent.click(await screen.findByLabelText(/primary care/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/choose-facility-type',
      ),
    );
  });

  it('should show eye care type of care page', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    fireEvent.click(await screen.findByLabelText(/eye care/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/choose-eye-care',
      ),
    );
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfEyeCarePage} />, {
      store,
    });

    fireEvent.click(await screen.findByLabelText(/ophthalmology/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/va-facility',
      ),
    );
  });

  it('should facility type page when CC eligible and optometry is chosen', async () => {
    const parentSite983 = {
      id: '983',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983',
        rootStationCode: '983',
        parentStationCode: '983',
      },
    };
    mockParentSites(['983'], [parentSite983]);
    mockCommunityCareEligibility({
      parentSites: ['983'],
      careType: 'Optometry',
    });
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    fireEvent.click(await screen.findByLabelText(/eye care/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/choose-eye-care',
      ),
    );
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfEyeCarePage} />, {
      store,
    });

    fireEvent.click(await screen.findByLabelText(/optometry/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/choose-facility-type',
      ),
    );
  });
  it('should show audiology type of care page', () => {});
  it('should show sleep medicine type of care page', () => {});
  it('should show update address modal when no address', () => {});
});
