/* eslint-disable camelcase */
import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import DowntimeBanners from 'platform/user/authentication/components/DowntimeBanner';
import { DOWNTIME_BANNER_CONFIG } from 'platform/user/authentication/downtime';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import environment from '~/platform/utilities/environment';
import { statuses } from './fixtures/mock-downtime';

const server = setupServer();
const STATUSES_URL = `${environment.API_URL}/v0/backend_statuses`;

const baseResponse = {
  data: {
    attributes: {
      reported_at: '2019-03-21T16:54:34.000Z',
      statuses: [],
    },
  },
};

const generateMultipleStatuses = () => {
  const result = { ...baseResponse };

  const downStatuses = statuses.reduce((acc, cv) => {
    if (cv.serviceId === 'mvi' || cv.serviceId === 'idme') {
      acc.push({ ...cv, status: 'nope' });
    }
    return acc;
  }, []);

  result.data.attributes.statuses = downStatuses;

  return result;
};

const generateSingleStatus = (serviceDown = false, serviceId = 'mvi') => {
  const result = { ...baseResponse };

  result.data.attributes.statuses = statuses.map(el => {
    return {
      ...el,
      status: serviceDown && el.serviceId === serviceId ? 'nope' : 'active',
    };
  });

  return result;
};

const generateMockResponse = (
  serviceDown = false,
  serviceId = 'mvi',
  isMultipleServices = false,
) => {
  return isMultipleServices
    ? generateMultipleStatuses()
    : generateSingleStatus(serviceDown, serviceId);
};

beforeEach(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  server.close();
});

describe('DowntimeBanner', () => {
  const downtimeBannersWithoutMultipleOrMaint = Object.keys(
    DOWNTIME_BANNER_CONFIG,
  ).filter(dt => !['multipleServices', 'maintenance'].includes(dt));

  it('should NOT display banner if statuses are active', () => {
    server.use(
      rest.get(STATUSES_URL, (_, res, ctx) => {
        return res(ctx.json(generateMockResponse()));
      }),
    );

    const screen = renderInReduxProvider(<DowntimeBanners />);

    expect(
      screen.queryByText(
        /You may have trouble signing in or using some tools or services/i,
      ),
    ).to.not.exist;
  });

  downtimeBannersWithoutMultipleOrMaint.forEach(key => {
    it(`should display banner if ${key} service is down`, async () => {
      server.use(
        rest.get(STATUSES_URL, (_, res, ctx) => {
          return res(ctx.json(generateMockResponse(true, key)));
        }),
      );
      const { findByText } = renderInReduxProvider(<DowntimeBanners />);

      const expectedText = DOWNTIME_BANNER_CONFIG[key].headline;

      expect(await findByText(expectedText)).to.exist;
    });
  });

  it('should display banner if multipleServices are down', async () => {
    server.use(
      rest.get(STATUSES_URL, (_, res, ctx) => {
        return res(ctx.json(generateMockResponse(false, 'mvi', true)));
      }),
    );
    const { findByText } = renderInReduxProvider(<DowntimeBanners />);

    const expectedText = DOWNTIME_BANNER_CONFIG.multipleServices.headline;

    expect(await findByText(expectedText)).to.exist;
  });
});
