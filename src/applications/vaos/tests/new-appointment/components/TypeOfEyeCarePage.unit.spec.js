import React from 'react';
import { Route } from 'react-router-dom';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import { getParentSiteMock } from '../../mocks/v0';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
} from '../../mocks/setup';
import { mockParentSites } from '../../mocks/helpers';

import TypeOfEyeCarePage from '../../../new-appointment/components/TypeOfEyeCarePage';
import {
  mockSchedulingConfigurations,
  mockV2CommunityCareEligibility,
} from '../../mocks/helpers.v2';
import { getSchedulingConfigurationMock } from '../../mocks/v2';
import { createMockFacilityByVersion } from '../../mocks/data';
import { mockFacilitiesFetchByVersion } from '../../mocks/fetch';

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

describe('VAOS Page: TypeOfEyeCarePage', () => {
  beforeEach(() => {
    mockFetch();
    mockSchedulingConfigurations(
      [
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'primaryCare',
          requestEnabled: true,
        }),
      ],
      true,
    );
  });
  it('should show page and validation', async () => {
    const store = createTestStore(initialState);
    const nextPage = await setTypeOfCare(store, /eye care/i);
    expect(nextPage).to.equal('/new-appointment/choose-eye-care');

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfEyeCarePage} />,
      {
        store,
      },
    );

    expect((await screen.findAllByRole('radio')).length).to.equal(2);
    fireEvent.click(screen.getByText(/Continue/));

    expect(await screen.findByText('Please provide a response')).to.exist;
    expect(screen.history.push.called).to.not.be.true;

    fireEvent.click(await screen.findByLabelText(/ophthalmology/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/ophthalmology/i).checked).to.be.true;
    });
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/va-facility-2',
      ),
    );
  });

  it('should save eye care choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfEyeCarePage} />,
      { store },
    );

    fireEvent.click(await screen.findByLabelText(/optometry/i));
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfEyeCarePage} />, {
      store,
    });

    expect(await screen.findByLabelText(/optometry/i)).to.have.attribute(
      'checked',
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
    mockV2CommunityCareEligibility({
      parentSites: ['983', '983GC'],
      supportedSites: ['983GC'],
      careType: 'Optometry',
    });
    mockFacilitiesFetchByVersion({
      children: true,
      facilities: [
        createMockFacilityByVersion({
          id: '983',
        }),
      ],
    });

    const store = createTestStore(initialState);
    const nextPage = await setTypeOfCare(store, /eye care/i);
    expect(nextPage).to.equal('/new-appointment/choose-eye-care');

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfEyeCarePage} />,
      {
        store,
      },
    );

    fireEvent.click(await screen.findByLabelText(/optometry/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/choose-facility-type',
      ),
    );
  });
});
