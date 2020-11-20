import React from 'react';
import { Route } from 'react-router-dom';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';

import set from 'platform/utilities/data/set';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import { getParentSiteMock } from '../../mocks/v0';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import {
  mockCommunityCareEligibility,
  mockParentSites,
} from '../../mocks/helpers';

import TypeOfCarePage from '../../../new-appointment/components/TypeOfCarePage';
import { NewAppointment } from '../../../new-appointment';
import moment from 'moment';
import environment from 'platform/utilities/environment';

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

describe('VAOS <TypeOfCarePage>', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());
  it('should show type of care page with all care types', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    expect((await screen.findAllByRole('radio')).length).to.equal(11);

    // Verify alert is shown
    expect(
      screen.getByRole('heading', {
        name: /not seeing the type of care you need\?/i,
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
      'alert-box-heading': 'Not seeing the type of care you need',
      'alert-box-subheading': undefined,
      'alert-box-type': 'informational',
      event: 'nav-alert-box-link-click',
    });

    expect(screen.queryByText(/You need to have a home address/i)).to.not.exist;

    fireEvent.click(screen.getByText(/Continue/));

    expect(await screen.findByText('Please choose a type of care')).to.exist;
    expect(screen.history.push.called).to.not.be.true;

    fireEvent.click(await screen.findByLabelText(/primary care/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-appointment/va-facility',
      ),
    );
  });

  it('should save type of care choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfCarePage} />,
      { store },
    );

    fireEvent.click(await screen.findByLabelText(/primary care/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/primary care/i).checked).to.be.true;
    });
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-appointment/va-facility',
      ),
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

    expect((await screen.findAllByRole('radio')).length).to.equal(10);
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
      /not eligible to request a community care Podiatry appointment online at this time/i,
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
      parentSites: ['983', '983GC'],
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
    const screen = renderWithStoreAndRouter(
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
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/choose-sleep-care',
      ),
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

    expect(await screen.findByText(/You need to have a home address/i)).to
      .exist;
    expect(global.window.dataLayer[0].event).to.equal(
      'vaos-update-address-alert-displayed',
    );
    fireEvent.click(screen.getByText('Update your address'));
    await waitFor(
      () =>
        expect(screen.queryByText(/You need to have a home address/i)).to.not
          .exist,
    );
    expect(global.window.dataLayer[1].event).to.equal(
      'nav-warning-alert-box-content-link-click',
    );
    expect(global.window.dataLayer[1].alertBoxHeading).to.equal(
      "You need to have a home address on file to use some of the tool's features",
    );
    expect(global.window.dataLayer[2].alertBoxHeading).to.equal(undefined);
  });

  it('should display alert message when residental address is a PO Box', async () => {
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

    expect(await screen.findByText(/You need to have a home address/i)).to
      .exist;
  });

  it('should save adress modal dismissal after page change', async () => {
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

    expect(await screen.findByText(/You need to have a home address/i)).to
      .exist;
    fireEvent.click(screen.getByText('Update your address'));
    await waitFor(
      () =>
        expect(screen.queryByText(/You need to have a home address/i)).to.not
          .exist,
    );
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfCarePage} />, {
      store,
    });

    expect(screen.queryByText(/You need to have a home address/i)).to.not.exist;
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
              externalService: 'vaosWarning',
              description: 'My description',
              startTime: moment.utc().subtract('1', 'days'),
              endTime: moment.utc().add('1', 'days'),
            },
          },
        ],
      },
    );
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<NewAppointment />, {
      store,
    });

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /You may have trouble using the VA appointments tool right now/,
      }),
    ).to.exist;
  });
});
