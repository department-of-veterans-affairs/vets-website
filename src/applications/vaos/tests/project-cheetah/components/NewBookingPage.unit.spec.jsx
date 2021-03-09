import React from 'react';
import { expect } from 'chai';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { NewBooking } from '../../../project-cheetah';
import { getDirectBookingEligibilityCriteriaMock } from '../../../tests/mocks/v0';
import { mockDirectBookingEligibilityCriteria } from '../../../tests/mocks/helpers';
import { waitFor } from '@testing-library/dom';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [
        { facilityId: '983', isCerner: false },
        { facilityId: '984', isCerner: false },
      ],
    },
  },
};

describe('VAOS <ConfirmedAppointmentDetailsPage>', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('should not redirect the user to the Contact Facilities page', async () => {
    const store = createTestStore({
      ...initialState,
    });

    const response = getDirectBookingEligibilityCriteriaMock({
      typeOfCareId: '301',
    });
    // response.attributes.coreSettings[0].id = '301';
    // response.attributes.coreSettings[0].typeOfCare = 'Vaccine';

    mockDirectBookingEligibilityCriteria(
      ['983', '984'],
      [
        {
          ...response,
        },
      ],
    );

    const screen = renderWithStoreAndRouter(<NewBooking />, {
      store,
    });

    await screen.findByRole('heading', { level: 1, name: 'Plan ahead' });

    expect(screen.history.push.lastCall.args[0]).to.equal('/');
  });

  it('should redirect the user to the Contact Facilities page', async () => {
    const store = createTestStore({
      ...initialState,
    });

    const response = getDirectBookingEligibilityCriteriaMock();
    delete response.attributes.coreSettings[0].patientHistoryRequired;

    mockDirectBookingEligibilityCriteria(
      ['983', '984'],
      [
        {
          ...response,
        },
      ],
    );

    const screen = renderWithStoreAndRouter(<NewBooking />, {
      store,
    });

    // Wait for the redirect.
    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-covid-19-vaccine-booking/contact-facilities',
      ),
    );
  });
});
