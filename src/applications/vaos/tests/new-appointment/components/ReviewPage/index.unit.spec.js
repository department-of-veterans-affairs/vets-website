import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';

import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import ReviewPage from '../../../../new-appointment/components/ReviewPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS Page: ReviewPage', () => {
  it('should return to appointment list page if no data', async () => {
    const store = createTestStore({
      ...initialState,
      newAppointment: {
        pages: {},
        data: {},
        clinics: {},
        parentfacilities: [],
        facilityDetails: {},
        facilities: {},
      },
    });

    const screen = renderWithStoreAndRouter(<Route component={ReviewPage} />, {
      store,
    });

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal('/new-appointment');
    });
  });
});
