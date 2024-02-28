// import React from 'react';
// import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
// import { expect } from 'chai';
import DowntimeBanners from 'platform/user/authentication/components/DowntimeBanner';
// import {
//   DOWNTIME_BANNER_CONFIG,
//   AUTH_DEPENDENCIES,
// } from 'platform/user/authentication/constants';

// const generateState = ({ serviceId = 'mvi', serviceDown = false }) => ({
//   externalServiceStatuses: {
//     loading: false,
//     shouldGetBackendStatuses: false,
//     statuses: AUTH_DEPENDENCIES.map(deps => ({
//       service: deps.toUpperCase(),
//       serviceId: deps,
//       status: serviceId === deps && serviceDown ? 'inactive' : 'active',
//     })),
//   },
// });

// describe.skip('DowntimeBanner', () => {
//   it.skip('should not display banner if statuses are active', () => {
//     const screen = renderInReduxProvider(<DowntimeBanners />, {
//       initialState: generateState({ serviceId: 'mvi', serviceDown: false }),
//     });

//     expect(
//       screen.queryByText(
//         /You may have trouble signing in or using some tools or services/i,
//       ),
//     ).to.be.null;
//   });

//   AUTH_DEPENDENCIES.forEach(csp => {
//     it.skip(`should display ${csp} banner when status is inactive`, () => {
//       const screen = renderInReduxProvider(<DowntimeBanners />, {
//         initialState: generateState({ serviceId: csp, serviceDown: true }),
//       });

//       const { headline } = DOWNTIME_BANNER_CONFIG[csp];

//       expect(screen.queryByText(headline)).to.not.be.null;
//     });
//   });
// });

// describe.skip('mapStateToProps', () => {
//   describe.skip('externalServiceStatuses', () => {
//     it.skip('should display props', () => {
//       expect(
//         mapStateToProps({
//           externalServiceStatuses: {
//             shouldGetBackendStatuses: true,
//             statuses: null,
//           },
//         }).shouldGetBackendStatuses,
//       ).to.be.true;
//     });
//   });
// });

import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

describe('DowntimeBanners Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      externalServiceStatuses: {
        loading: false,
        statuses: [],
        maintenanceWindows: [],
      },
    });
  });

  test('renders component without errors', () => {
    render(
      <Provider store={store}>
        <DowntimeBanners />
      </Provider>,
    );
  });

  // test('dispatches getBackendStatusAction on mount if not loading and not localhost', () => {
  //   const mockGetBackendStatusAction = jest.fn();
  //   jest.mock('platform/monitoring/external-services/actions', () => ({
  //     getBackendStatuses: mockGetBackendStatusAction,
  //   }));

  //   render(
  //     <Provider store={store}>
  //       <DowntimeBanner />
  //     </Provider>,
  //   );

  //   expect(mockGetBackendStatusAction).toHaveBeenCalledTimes(1);
  // });

  // test('does not dispatch getBackendStatusAction on mount if loading', () => {
  //   store = mockStore({
  //     externalServiceStatuses: {
  //       loading: true,
  //       statuses: [],
  //       maintenanceWindows: [],
  //     },
  //   });

  //   render(
  //     <Provider store={store}>
  //       <DowntimeBanner />
  //     </Provider>,
  //   );

  //   const mockGetBackendStatusAction = jest.fn();
  //   jest.mock('platform/monitoring/external-services/actions', () => ({
  //     getBackendStatuses: mockGetBackendStatusAction,
  //   }));

  //   expect(mockGetBackendStatusAction).not.toHaveBeenCalled();
  // });

  // test('does not dispatch getBackendStatusAction on mount if localhost', () => {
  //   store = mockStore({
  //     externalServiceStatuses: {
  //       loading: false,
  //       statuses: [],
  //       maintenanceWindows: [],
  //     },
  //   });
  //   jest
  //     .spyOn(require('platform/utilities/environment'), 'isLocalhost')
  //     .mockReturnValue(true);

  //   render(
  //     <Provider store={store}>
  //       <DowntimeBanner />
  //     </Provider>,
  //   );

  //   const mockGetBackendStatusAction = jest.fn();
  //   jest.mock('platform/monitoring/external-services/actions', () => ({
  //     getBackendStatuses: mockGetBackendStatusAction,
  //   }));

  //   expect(mockGetBackendStatusAction).not.toHaveBeenCalled();
  // });
});
