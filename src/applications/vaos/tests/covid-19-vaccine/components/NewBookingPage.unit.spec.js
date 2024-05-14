import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { NewBookingSection } from '../../../covid-19-vaccine';
import { mockFacilitiesFetchByVersion } from '../../mocks/fetch';
import { createMockFacilityByVersion } from '../../mocks/data';
import { mockSchedulingConfigurations } from '../../mocks/helpers.v2';
import { getSchedulingConfigurationMock } from '../../mocks/v2';

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

describe('VAOS vaccine flow: NewBookingSection', () => {
  beforeEach(() => {
    mockFetch();
  });

  it('should not redirect the user to the Contact Facility page when facilities are available', async () => {
    const store = createTestStore({
      ...initialState,
    });

    mockFacilitiesFetchByVersion({
      children: true,
      facilities: [
        createMockFacilityByVersion({
          id: '983',
          name: 'A facility',
        }),
        createMockFacilityByVersion({
          id: '984',
          name: 'B facility',
        }),
      ],
    });
    mockSchedulingConfigurations([
      getSchedulingConfigurationMock({
        id: '983',
        typeOfCareId: 'covid',
        requestEnabled: true,
        directEnabled: true,
      }),
      getSchedulingConfigurationMock({
        id: '984',
        typeOfCareId: 'primaryCare',
        requestEnabled: true,
      }),
    ]);

    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
    });

    await screen.findByRole('heading', {
      level: 1,
      name: 'COVID-19 vaccine appointment',
    });
  });

  it('should redirect the user to the Contact Facility page when facilities are not available', async () => {
    const store = createTestStore({
      ...initialState,
    });

    mockFacilitiesFetchByVersion({
      children: true,
      facilities: [
        createMockFacilityByVersion({
          id: '983',
          name: 'Facility that is enabled',
          lat: 39.1362562,
          long: -83.1804804,
          address: {
            city: 'Bozeman',
            state: 'MT',
          },
          phone: '5555555555x1234',
        }),
        createMockFacilityByVersion({
          id: '984',
          name: 'Facility 2',
        }),
      ],
    });
    mockSchedulingConfigurations([
      getSchedulingConfigurationMock({
        id: '983',
        typeOfCareId: 'covid',
        requestEnabled: true,
      }),
      getSchedulingConfigurationMock({
        id: '984',
        typeOfCareId: 'primaryCare',
        requestEnabled: true,
      }),
    ]);

    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
    });

    expect(
      await screen.findByText(/Contact one of your registered VA facilities/i),
    ).to.be.ok;
  });

  it('should render warning message', async () => {
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
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
      basename: '/new-covid-19-vaccine-appointment',
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

    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
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
