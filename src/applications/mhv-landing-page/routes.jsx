/* eslint-disable @department-of-veterans-affairs/no-cross-app-imports */
import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import asyncLoader from '@department-of-veterans-affairs/platform-utilities/asyncLoader';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';
import LandingPageContainer from './containers/LandingPageContainer';

//     /* eslint-disable-next-line camelcase */
//     UNSAFE_componentWillMount() {
//       if (!this.state.Component) {
//         this.componentPromise = getComponent()
//           .then(m => (m.default ? m.default : m))
//           .then(Component => {
//             AsyncComponent.Component = Component;
//             this.setState({ Component });
//           });
//       } else if (!this.componentPromise) {
//         this.componentPromise = Promise.resolve();
//       }
//     }

//     render() {
//       const { Component } = this.state;
//       if (Component) {
//         return <Component {...this.props} />;
//       }
//       return (
//         <div className="async-loader">
//           <va-loading-indicator message={message || 'Loading page...'} />
//         </div>
//       );
//     }
//   };
// }

// const AsyncSecureMessagingRoutes = store =>
//   asyncLoader(() =>
//     import('../mhv-secure-messaging/routes').then(
//       ({ default: MhvSecureMessagingRoutes, reducer }) => {
//         store.injectReducer('MhvSecureMessagingRoutes', reducer);
//         return MhvSecureMessagingRoutes;
//       },
//     ),
//   );
const AsyncSecureMessagingRoutes = asyncLoader(() =>
  import('../mhv-secure-messaging/routes').then(
    ({ default: MhvSecureMessagingRoutes }) => {
      return MhvSecureMessagingRoutes;
    },
  ),
);

const AsyncAppointmentsRoutes = asyncLoader(() =>
  import('../vaos/routes').then(({ default: AppointmentsRoutes }) => {
    return AppointmentsRoutes;
  }),
);

const routes = () => (
  <AppConfig>
    <Routes>
      <Route path="/" element={<LandingPageContainer />} />
      <Route
        path="/my-secure-messages/*"
        element={<AsyncSecureMessagingRoutes />}
        key="mhvSecureMessages"
      />
      <Route
        path="/my-appointments/*"
        element={<AsyncAppointmentsRoutes />}
        key="appointments"
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </AppConfig>
);

export default routes;
