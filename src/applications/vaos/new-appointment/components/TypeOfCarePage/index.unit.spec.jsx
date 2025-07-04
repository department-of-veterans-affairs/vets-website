/* eslint-disable camelcase */
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Route } from 'react-router-dom';

import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import set from 'platform/utilities/data/set';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { addDays, format, subDays } from 'date-fns';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';

import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import TypeOfCarePage from './index';

import { NewAppointment } from '../..';
import {
  mockFacilitiesApi,
  mockV2CommunityCareEligibility,
} from '../../../tests/mocks/mockApis';
import { DATE_FORMATS, FLOW_TYPES } from '../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCommunityCare: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
      vapContactInfo: {
        residentialAddress: {
          addressLine1: '123 big sky st',
        },
      },
    },
  },
};

describe('VAOS Page: TypeOfCarePage', () => {
  beforeEach(() => mockFetch());

  it('should open facility type page when CC eligible and has a supported parent site', async () => {
    mockFacilitiesApi({
      ids: ['983'],
      response: [
        new MockFacilityResponse({ isParent: true }),
        new MockFacilityResponse({ id: '983GC', isParent: true }),
      ],
    });
    mockV2CommunityCareEligibility({
      parentSites: ['983', '983GC'],
      supportedSites: ['983GC'],
      careType: 'PrimaryCare',
    });
    const store = createTestStore({
      ...initialState,
    });
    const screen = renderWithStoreAndRouter(<TypeOfCarePage />, { store });

    fireEvent.click(await screen.findByLabelText(/primary care/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal('facility-type'),
    );
  });

  it('should skip facility type page if eligible for CC but no supported sites', async () => {
    mockFacilitiesApi({
      ids: ['983'],
      response: [
        new MockFacilityResponse({ isParent: true }),
        new MockFacilityResponse({ id: '983GC', isParent: true }),
      ],
    });
    mockV2CommunityCareEligibility({
      parentSites: ['983', '983GC'],
      supportedSites: [],
      careType: 'PrimaryCare',
    });
    const store = createTestStore({
      ...initialState,
    });
    const screen = renderWithStoreAndRouter(<TypeOfCarePage />, { store });

    fireEvent.click(await screen.findByLabelText(/primary care/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal('location'),
    );
  });

  it('should show type of care page with all care types', async () => {
    const store = createTestStore(initialState);
    mockV2CommunityCareEligibility({
      parentSites: [],
      supportedSites: [],
      careType: 'PrimaryCare',
      eligible: false,
    });
    const screen = renderWithStoreAndRouter(<TypeOfCarePage />, { store });

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /What type of care do you need/,
      }),
    ).to.exist;
    expect((await screen.findAllByRole('radio')).length).to.equal(12);

    // Verify alert is shown
    expect(
      screen.getByRole('heading', {
        name: /Is the type of care you need not listed here\?/i,
      }),
    ).to.exist;
    expect(
      screen.getByText(
        /you’ll need to call your va health facility to schedule an appointment./i,
      ),
    ).to.exist;
    expect(screen.getByRole('link', { name: /find a va location/i })).to.exist;
    fireEvent.click(screen.getByText(/Find a VA location/i));

    expect(global.window.dataLayer[0]).to.eql({
      'alert-box-click-label': 'Find a VA location',
      'alert-box-heading': 'Is the type of care you need not listed here',
      'alert-box-subheading': undefined,
      'alert-box-type': 'informational',
      event: 'nav-alert-box-link-click',
    });

    expect(
      screen.queryByText(
        /To use some of the tool’s features, you need a home address on file/i,
      ),
    ).to.not.exist;

    fireEvent.click(screen.getByText(/Continue/));

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /What type of care do you need/,
      }),
    ).to.exist;
    expect(screen.history.push.called).to.not.be.true;

    fireEvent.click(await screen.findByLabelText(/primary care/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('location'),
    );
  });

  it('should save type of care choice on page change', async () => {
    const store = createTestStore(initialState);
    mockV2CommunityCareEligibility({
      parentSites: [],
      supportedSites: [],
      careType: 'PrimaryCare',
      eligible: false,
    });
    let screen = renderWithStoreAndRouter(<TypeOfCarePage />, { store });

    fireEvent.click(await screen.findByLabelText(/primary care/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('location'),
    );
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfCarePage} />, {
      store,
    });

    expect(await screen.findByLabelText(/primary care/i)).to.have.attribute(
      'checked',
    );
  });

  it('should show type of care page without podiatry when CC flag is off', async () => {
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

    expect((await screen.findAllByRole('radio')).length).to.equal(11);
  });

  it('should show type of care page without podiatry when vaOnlineSchedulingRemovePodiatry feature flag is on and CC flag is on', async () => {
    const store = createTestStore({
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingCommunityCare: true,
        vaOnlineSchedulingRemovePodiatry: true,
      },
    });
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    expect((await screen.findAllByRole('radio')).length).to.equal(11);
  });

  it('should not allow users who are not CC eligible to use Podiatry', async () => {
    const store = createTestStore(initialState);
    mockV2CommunityCareEligibility({
      parentSites: [],
      supportedSites: [],
      careType: 'PrimaryCare',
      eligible: false,
    });
    mockFacilitiesApi({ ids: ['983'] });
    const screen = renderWithStoreAndRouter(<TypeOfCarePage />, { store });

    fireEvent.click(await screen.findByLabelText(/podiatry/i));
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /not eligible to request a community care Podiatry appointment online at this time/i,
    );
    expect(screen.queryByTestId('toc-modal')).to.exist;
    expect(
      screen.queryByTestId('toc-modal').getAttribute('primary-button-text'),
    ).to.eq('Ok');
    expect(screen.queryByTestId('toc-modal')).to.have.attribute(
      'visible',
      'true',
    );
    const okButton = screen.queryByTestId('toc-modal').__events
      .primaryButtonClick;
    await okButton();
    expect(screen.queryByTestId('toc-modal')).to.be.null;
  });

  it('should show eye care type of care page', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    fireEvent.click(await screen.findByLabelText(/eye care/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal('eye-care'),
    );
  });

  it('should show sleep medicine type of care page', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    fireEvent.click(await screen.findByLabelText(/sleep/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal('sleep-care'),
    );
  });

  it('should display alert message when residential address is missing', async () => {
    const stateWithoutAddress = set(
      'user.profile.vapContactInfo.residentialAddress',
      null,
      initialState,
    );
    const store = createTestStore(stateWithoutAddress);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    expect(
      await screen.findByText(
        /To use some of the tool’s features, you need a home address on file/i,
      ),
    ).to.exist;
    await waitFor(() =>
      expect(global.window.dataLayer[0].event).to.equal(
        'vaos-update-address-alert-displayed',
      ),
    );
    fireEvent.click(
      screen.getByText('Go to your VA.gov profile (opens in new tab)'),
    );
    await waitFor(
      () =>
        expect(
          screen.queryByText(
            /To use some of the tool’s features, you need a home address on file/i,
          ),
        ).to.not.exist,
    );
    expect(global.window.dataLayer[1].event).to.equal(
      'nav-warning-alert-box-content-link-click',
    );
    expect(global.window.dataLayer[1].alertBoxHeading).to.equal(
      'To use some of the tool’s features, you need a home address on file',
    );
    expect(global.window.dataLayer[2].alertBoxHeading).to.equal(undefined);
  });

  it('should display alert message when residential address is a PO Box', async () => {
    const stateWithPOBox = set(
      'user.profile.vapContactInfo.residentialAddress',
      {
        addressLine1: 'PO Box 123',
      },
      initialState,
    );
    const store = createTestStore(stateWithPOBox);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    expect(
      await screen.findByText(
        /To use some of the tool’s features, you need a home address on file/i,
      ),
    ).to.exist;
  });

  it('should save address modal dismissal after page change', async () => {
    const stateWithoutAddress = set(
      'user.profile.vapContactInfo.residentialAddress',
      null,
      initialState,
    );
    const store = createTestStore(stateWithoutAddress);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    expect(
      await screen.findByText(
        /To use some of the tool’s features, you need a home address on file/i,
      ),
    ).to.exist;
    fireEvent.click(
      screen.getByText('Go to your VA.gov profile (opens in new tab)'),
    );
    await waitFor(
      () =>
        expect(
          screen.queryByText(
            /To use some of the tool’s features, you need a home address on files/i,
          ),
        ).to.not.exist,
    );
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfCarePage} />, {
      store,
    });
    await screen.findAllByRole('radio');

    expect(
      screen.queryByText(
        /To use some of the tool’s features, you need a home address on file/i,
      ),
    ).to.not.exist;
  });

  it('should render warning message', async () => {
    setFetchJSONResponse(
      global.fetch.withArgs(`${environment.API_URL}/v0/maintenance_windows/`),
      {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'vaoswarning',
              description: 'My description',
              startTime: format(
                subDays(new Date(), '1'),
                DATE_FORMATS.ISODateTimeUTC,
              ),
              endTime: format(
                addDays(new Date(), '1'),
                DATE_FORMATS.ISODateTimeUTC,
              ),
            },
          },
        ],
      },
    );

    const state = {
      ...initialState,
      newAppointment: {
        ...initialState.newAppointment,
        flowType: FLOW_TYPES.REQUEST,
        data: { facilityType: 'communityCare' },
        isNewAppointmentStarted: true,
        pages: {},
      },
    };
    const store = createTestStore(state);
    const screen = renderWithStoreAndRouter(<NewAppointment />, {
      store,
      path: '/type-of-care',
    });

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /You may have trouble using the VA appointments tool right now/,
      }),
    ).to.exist;
  });

  it('should include vaccine type of care when flag is on', async () => {
    const store = createTestStore({
      ...initialState,
      featureToggles: {
        vaOnlineSchedulingCommunityCare: true,
      },
    });
    const screen = renderWithStoreAndRouter(<TypeOfCarePage />, { store });
    expect((await screen.findAllByRole('radio')).length).to.equal(12);
    fireEvent.click(await screen.findByLabelText(/COVID-19 vaccine/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('covid-vaccine/'),
    );
  });
});
