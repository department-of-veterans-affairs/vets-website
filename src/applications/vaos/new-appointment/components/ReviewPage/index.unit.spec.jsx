import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';

import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';

import ReviewPage from '.';

describe('VAOS Page: ReviewPage', () => {
  it('should return to appointment list page if no data', async () => {
    const store = createTestStore({
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
