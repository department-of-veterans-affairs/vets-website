import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setVaccineFacility,
} from '../../mocks/setup';

import ClinicChoicePage from '../../../covid-19-vaccine/components/ClinicChoicePage';
import { TYPE_OF_CARE_ID } from '../../../covid-19-vaccine/utils';
import { mockEligibilityFetchesByVersion } from '../../mocks/fetch';
import { createMockClinicByVersion } from '../../mocks/data';

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

describe('VAOS vaccine flow <ClinicChoicePage>', () => {
  const clinic1 = createMockClinicByVersion({
    id: '308',
    stationId: '983',
    friendlyName: 'Green team clinic',
  });
  const clinic2 = createMockClinicByVersion({
    id: '309',
    stationId: '983',
    friendlyName: 'Red team clinic',
  });
  const clinics = [clinic1, clinic2];

  beforeEach(() => mockFetch());
  it('should display multiple clinics and require one to be chosen', async () => {
    mockEligibilityFetchesByVersion({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, '983', {
      name: 'Cheyenne VA Medical Center',
      address: {
        physical: {
          zip: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          address1: '2360 East Pershing Boulevard',
        },
      },
      phone: {
        main: '307-778-7550',
      },
    });

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
      () => expect(screen.getByLabelText(/red team/i).checked).to.be.true,
    );
    userEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-covid-19-vaccine-appointment/select-date',
      ),
    );
  });

  it('should retain form data after page changes', async () => {
    mockEligibilityFetchesByVersion({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, '983');

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
