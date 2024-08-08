/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import sinon from 'sinon'; // Import sinon for stubbing

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
  const server = setupServer();
  let sessionStorageStub;

  before(() => {
    // Stub sessionStorage before the tests run
    sessionStorageStub = sinon.stub(global, 'sessionStorage').value({
      getItem: sinon.stub().returns(null), // Return `null` or appropriate value for tests
      setItem: sinon.stub(),
      clear: sinon.stub(),
    });

    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  after(() => {
    server.close();
    sessionStorageStub.restore(); // Restore sessionStorage after all tests run
  });

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
