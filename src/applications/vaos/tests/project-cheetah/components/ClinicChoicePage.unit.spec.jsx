import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setVaccineFacility,
} from '../../mocks/setup';
import userEvent from '@testing-library/user-event';

import ClinicChoicePage from '../../../project-cheetah/components/ClinicChoicePage';
import { mockEligibilityFetches } from '../../mocks/helpers';
import { getClinicMock } from '../../mocks/v0';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { TYPE_OF_CARE_ID } from '../../../project-cheetah/utils';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS vaccine flow <ClinicChoicePage>', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());
  it('should display multiple clinics and require one to be chosen', async () => {
    const clinics = [
      {
        id: '308',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '308',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Green team clinic',
        },
      },
      {
        id: '309',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '309',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Red team clinic',
        },
      },
    ];
    mockEligibilityFetches({
      siteId: '983',
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

    await screen.findByText(/Choose a clinic located at/i);

    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');

    expect(await screen.findAllByRole('radio')).to.have.length(2);
    expect(screen.getByRole('radio', { name: /Green team clinic/ })).to.be.ok;
    expect(screen.getByRole('radio', { name: /Red team clinic/ })).to.be.ok;

    userEvent.click(screen.getByText(/continue/i));

    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
    expect(screen.history.push.called).not.to.be.true;

    userEvent.click(screen.getByLabelText(/red team/i));
    await waitFor(
      () => expect(screen.getByLabelText(/red team/i).checked).to.be.true,
    );
    userEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-covid-19-vaccine-booking/select-date-1',
      ),
    );
  });

  it('should retain form data after page changes', async () => {
    const clinics = [
      {
        id: '308',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '308',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Green team clinic',
        },
      },
      {
        id: '309',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '309',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Red team clinic',
        },
      },
    ];
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, '983');

    let screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    await screen.findByText(/Choose a clinic located at/i);

    userEvent.click(screen.getByLabelText(/red team/i));
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
