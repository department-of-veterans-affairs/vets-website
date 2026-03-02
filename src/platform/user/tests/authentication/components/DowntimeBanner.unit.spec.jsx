/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';

import environment from '~/platform/utilities/environment';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import DowntimeBanners from 'platform/user/authentication/components/DowntimeBanner';
import { DOWNTIME_BANNER_CONFIG } from 'platform/user/authentication/downtime';
import { statuses } from './fixtures/mock-downtime';

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

  result.data.attributes.statuses = statuses.reduce((acc, cv) => {
    if (cv.serviceId === 'mvi' || cv.serviceId === 'idme') {
      acc.push({ ...cv, status: 'nope' });
    }
    return acc;
  }, []);

  return result;
};

const generateSingleStatus = (serviceDown = false, serviceId = 'mvi') => {
  const result = { ...baseResponse };

  result.data.attributes.statuses = statuses.map(el => ({
    ...el,
    status: serviceDown && el.serviceId === serviceId ? 'nope' : 'active',
  }));

  return result;
};

const generateMockResponse = (
  serviceDown = false,
  serviceId = 'mvi',
  isMultipleServices = false,
) =>
  isMultipleServices
    ? generateMultipleStatuses()
    : generateSingleStatus(serviceDown, serviceId);

describe('DowntimeBanner', () => {
  const downtimeBannersWithoutMultipleOrMaint = Object.keys(
    DOWNTIME_BANNER_CONFIG,
  ).filter(dt => !['multipleServices', 'maintenance'].includes(dt));

  it('should NOT display banner if statuses are active', () => {
    server.use(
      createGetHandler(STATUSES_URL, () => {
        return jsonResponse(generateMockResponse());
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
        createGetHandler(STATUSES_URL, () => {
          return jsonResponse(generateMockResponse(true, key));
        }),
      );
      const { findByText } = renderInReduxProvider(<DowntimeBanners />);

      const expectedText = DOWNTIME_BANNER_CONFIG[key].headline;

      expect(await findByText(expectedText)).to.exist;
    });
  });

  it('should display banner if multipleServices are down', async () => {
    server.use(
      createGetHandler(STATUSES_URL, () => {
        return jsonResponse(generateMockResponse(false, 'mvi', true));
      }),
    );
    const { findByText } = renderInReduxProvider(<DowntimeBanners />);

    const expectedText = DOWNTIME_BANNER_CONFIG.multipleServices.headline;

    expect(await findByText(expectedText)).to.exist;
  });
});
