import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setVaccineFacility,
} from '../../tests/mocks/setup';
import MockFacilityResponse from '../../tests/fixtures/MockFacilityResponse';

import MockClinicResponse from '../../tests/fixtures/MockClinicResponse';
import { mockEligibilityFetches } from '../../tests/mocks/mockApis';
import { TYPE_OF_CARE_IDS } from '../../utils/constants';
import ClinicChoicePage from './ClinicChoicePage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS vaccine flow: ClinicChoicePage', () => {
  const clinics = MockClinicResponse.createResponses({
    clinics: [{ name: 'Green team clinic' }, { name: 'Red team clinic' }],
  });

  beforeEach(() => mockFetch());
  it('should display multiple clinics and require one to be chosen', async () => {
    mockEligibilityFetches({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
      clinics,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, new MockFacilityResponse());

    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    await screen.findByText(
      /Cheyenne VA Medical Center clinics offer vaccine appointments at different times./i,
    );

    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');

    expect(await screen.findAllByRole('radio')).to.have.length(2);
    expect(screen.getByRole('radio', { name: /Green team clinic/ })).to.be.ok;
    expect(screen.getByRole('radio', { name: /Red team clinic/ })).to.be.ok;

    userEvent.click(screen.getByText(/continue/i));

    expect(await screen.findByRole('alert')).to.contain.text(
      'Please select a clinic for your appointment',
    );
    expect(screen.history.push.called).not.to.be.true;

    userEvent.click(screen.getByLabelText(/red team/i));
    await waitFor(
      () => expect(screen.getByLabelText(/reddd team/i).checked).to.be.true,
    );
    userEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal('date-time'),
    );
  });

  it('should retain form data after page changes', async () => {
    mockEligibilityFetches({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
      clinics,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, new MockFacilityResponse());

    let screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    userEvent.click(await screen.findByLabelText(/red team/i));
    await waitFor(
      () => expect(screen.getByLabelText(/red team/i).checked).to.be.true,
    );

    await cleanup();

    screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });
    await waitFor(
      () => expect(screen.getByLabelText(/red team/i).checked).to.be.true,
    );
  });
});
