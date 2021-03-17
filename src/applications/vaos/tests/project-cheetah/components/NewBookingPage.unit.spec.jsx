import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import environment from 'platform/utilities/environment';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { NewBooking } from '../../../project-cheetah';
import {
  getDirectBookingEligibilityCriteriaMock,
  getVAFacilityMock,
} from '../../../tests/mocks/v0';
import {
  mockDirectBookingEligibilityCriteria,
  mockFacilitiesFetch,
  mockRequestEligibilityCriteria,
} from '../../../tests/mocks/helpers';
import { TYPE_OF_CARE_ID } from '../../../project-cheetah/utils';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingCheetah: true,
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

describe('VAOS vaccine flow', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('should not redirect the user to the Contact Facilities page when facilities are available', async () => {
    const store = createTestStore({
      ...initialState,
    });

    mockDirectBookingEligibilityCriteria(
      ['983', '984'],
      [
        getDirectBookingEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: 'covid',
        }),
      ],
    );

    const screen = renderWithStoreAndRouter(<NewBooking />, {
      store,
    });

    await screen.findByRole('heading', {
      level: 1,
      name: 'COVID-19 vaccine appointment',
    });
  });

  it('should redirect the user to the Contact Facilities page when facilities are not available', async () => {
    const store = createTestStore({
      ...initialState,
    });

    mockFacilitiesFetch('vha_442', [
      {
        id: '983',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '983',
          name: 'Facility that is enabled',
          lat: 39.1362562,
          long: -83.1804804,
          address: {
            physical: {
              city: 'Bozeman',
              state: 'MT',
            },
          },
          phone: {
            main: '5555555555x1234',
          },
        },
      },
    ]);
    mockRequestEligibilityCriteria(['983', '984'], []);
    mockDirectBookingEligibilityCriteria(
      ['983', '984'],
      [
        getDirectBookingEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: TYPE_OF_CARE_ID,
          patientHistoryRequired: null,
        }),
      ],
    );

    const screen = renderWithStoreAndRouter(<NewBooking />, {
      store,
    });

    expect(
      await screen.findByText(/Contact one of your registered VA facilities/i),
    ).to.be.ok;
  });

  it('should render warning message', async () => {
    mockDirectBookingEligibilityCriteria(
      ['983', '984'],
      [
        getDirectBookingEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: TYPE_OF_CARE_ID,
        }),
      ],
    );
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
    const screen = renderWithStoreAndRouter(<NewBooking />, {
      store,
      basename: '/new-covid-19-vaccine-booking',
    });

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /You may have trouble using the VA appointments tool right now/,
      }),
    ).to.exist;
  });

  it('should show error when facility availability check fails', async () => {
    const store = createTestStore({
      ...initialState,
    });

    const screen = renderWithStoreAndRouter(<NewBooking />, {
      store,
    });

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /We’re sorry. We’ve run into a problem/,
      }),
    ).to.exist;
  });
});
