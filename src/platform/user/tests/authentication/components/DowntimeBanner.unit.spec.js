/* eslint-disable camelcase */
import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import DowntimeBanners from 'platform/user/authentication/components/DowntimeBanner';
import { DOWNTIME_BANNER_CONFIG } from 'platform/user/authentication/downtime';
import { statuses, maintenanceWindows } from './fixtures/mock-downtime';

const generateState = ({
  serviceId = 'mvi',
  serviceDown = false,
  isApiDown = false,
  isMultipleServices = false,
}) => {
  return isMultipleServices
    ? {
        externalServiceStatuses: {
          loading: false,
          statuses: statuses.reduce((acc, cv) => {
            if (cv.serviceId === 'mvi' || cv.serviceId === 'idme') {
              acc.push({ ...cv, status: 'nope' });
            }
            return acc;
          }, []),
          maintenance_windows: [],
        },
        subscribe: () => {},
        dispatch: () => {},
      }
    : {
        externalServiceStatuses: {
          loading: false,
          statuses: isApiDown
            ? []
            : statuses?.map(el => {
                return {
                  ...el,
                  status:
                    serviceDown && el.serviceId === serviceId
                      ? 'nope'
                      : 'active',
                };
              }),
          maintenanceWindows: isApiDown ? [] : maintenanceWindows,
        },
        subscribe: () => {},
        dispatch: () => {},
      };
};

describe('DowntimeBanner', () => {
  const downtimeBannersWithoutMultipleOrMaint = Object.keys(
    DOWNTIME_BANNER_CONFIG,
  ).filter(dt => !['multipleServices', 'maintenance'].includes(dt));

  // it('should display banner if API is down', () => {
  //   const { queryByText } = renderInReduxProvider(<DowntimeBanners />, {
  //     initialState: generateState({ isApiDown: true }),
  //   });

  //   expect(
  //     queryByText(
  //       /You may have trouble signing in or using some tools or services/i,
  //     ),
  //   ).to.exist;
  // });

  it('should NOT display banner if statuses are active', () => {
    const screen = renderInReduxProvider(<DowntimeBanners />, {
      initialState: generateState({ serviceDown: false }),
    });

    expect(
      screen.queryByText(
        /You may have trouble signing in or using some tools or services/i,
      ),
    ).to.not.exist;
  });

  downtimeBannersWithoutMultipleOrMaint.forEach(key => {
    it(`should display banner if ${key} service is down`, () => {
      const { queryByText } = renderInReduxProvider(<DowntimeBanners />, {
        initialState: generateState({
          serviceDown: true,
          serviceId: key,
        }),
      });

      const expectedText = DOWNTIME_BANNER_CONFIG[key].headline;

      expect(queryByText(expectedText)).to.exist;
    });
  });

  it('should display banner if multipleServices are down', () => {
    const { queryByText } = renderInReduxProvider(<DowntimeBanners />, {
      initialState: generateState({
        isMultipleServices: true,
      }),
    });

    const expectedText = DOWNTIME_BANNER_CONFIG.multipleServices.headline;

    expect(queryByText(expectedText)).to.exist;
  });
});
