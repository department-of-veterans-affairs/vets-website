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
import { TYPE_OF_CARE_IDS } from '../../utils/constants';
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

    // Then the primary header should have focus
    const radioSelector = screen.container.querySelector('va-radio');
    expect(radioSelector).to.exist;
    expect(radioSelector).to.have.attribute(
      'label',
      'Which type of eye care do you need?',
    );

    // And the user should see radio buttons for each clinic
    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(2);
    expect(radioOptions[0]).to.have.attribute('label', 'Optometry');
    expect(radioOptions[1]).to.have.attribute('label', 'Ophthalmology');

    fireEvent.click(screen.getByText(/Continue/));
    // Then there should be a validation error
    // Assertion currently disabled due to
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/82624
    // expect(await screen.findByText('You must provide a response')).to.exist;
    expect(screen.history.push.called).to.not.be.true;

    const changeEvent = new CustomEvent('selected', {
      detail: { value: TYPE_OF_CARE_IDS.OPHTHALMOLOGY_ID },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    await waitFor(() => {
      expect(radioSelector).to.have.attribute(
        'value',
        TYPE_OF_CARE_IDS.OPHTHALMOLOGY_ID,
      );
    });

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

    const radioSelector = screen.container.querySelector('va-radio');
    const changeEvent = new CustomEvent('selected', {
      detail: { value: TYPE_OF_CARE_IDS.OPTOMETRY_ID },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfEyeCarePage} />, {
      store,
    });

    await waitFor(() => {
      expect(radioSelector).to.have.attribute(
        'value',
        TYPE_OF_CARE_IDS.OPTOMETRY_ID,
      );
    });
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

    const radioSelector = screen.container.querySelector('va-radio');
    const changeEvent = new CustomEvent('selected', {
      detail: { value: TYPE_OF_CARE_IDS.OPTOMETRY_ID },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal('facility-type'),
    );
  });
});
