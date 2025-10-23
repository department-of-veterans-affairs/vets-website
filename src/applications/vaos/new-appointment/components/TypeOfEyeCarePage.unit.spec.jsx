import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Route } from 'react-router-dom';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
} from '../../tests/mocks/setup';

import MockFacilityResponse from '../../tests/fixtures/MockFacilityResponse';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
} from '../../tests/fixtures/MockSchedulingConfigurationResponse';
import {
  mockFacilitiesApi,
  mockSchedulingConfigurationsApi,
  mockV2CommunityCareEligibility,
} from '../../tests/mocks/mockApis';
import TypeOfEyeCarePage from './TypeOfEyeCarePage';

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
    mockSchedulingConfigurationsApi({
      isCCEnabled: true,
      response: [
        new MockSchedulingConfigurationResponse({
          facilityId: '983',
          services: [
            new MockServiceConfiguration({
              typeOfCareId: 'primaryCare',
              requestEnabled: true,
            }),
          ],
        }),
      ],
    });
  });
  it('should show page and validation', async () => {
    const store = createTestStore(initialState);
    const nextPage = await setTypeOfCare(store, /eye care/i);
    expect(nextPage).to.equal('eye-care');

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfEyeCarePage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Should show title
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Which type of eye care do you need\?/,
      }),
    ).to.exist;

    // And the user should see radio buttons for each type of eye care
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(2);
    await screen.findByLabelText(/Optometry/i);
    await screen.findByLabelText(/Ophthalmology/i);

    // When the user continues
    fireEvent.click(screen.getByText(/Continue/));

    // The user should stay on the page
    expect(screen.history.push.called).to.be.false;

    // Then there should be a validation error
    expect(await screen.findByText('You must provide a response')).to.exist;

    fireEvent.click(screen.getByText(/Ophthalmology/));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal('location'),
    );
  });

  it('should save eye care choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfEyeCarePage} />,
      { store },
    );
    await screen.findByText(/Continue/i);

    fireEvent.click(screen.getByText(/Optometry/));
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfEyeCarePage} />, {
      store,
    });

    expect(await screen.findByLabelText(/Optometry/i)).to.have.attribute(
      'checked',
    );
  });

  it('should facility type page when CC eligible and optometry is chosen', async () => {
    mockV2CommunityCareEligibility({
      parentSites: ['983', '983GC'],
      supportedSites: ['983GC'],
      careType: 'Optometry',
    });
    mockFacilitiesApi({
      children: true,
      response: [new MockFacilityResponse({ id: '983' })],
    });

    const store = createTestStore(initialState);
    const nextPage = await setTypeOfCare(store, /eye care/i);
    expect(nextPage).to.equal('eye-care');

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfEyeCarePage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    fireEvent.click(screen.getByText(/Optometry/));
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal('facility-type'),
    );
  });
});
