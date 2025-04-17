/* eslint-disable @department-of-veterans-affairs/no-cross-app-imports */
import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';
import LandingPageContainer from './containers/LandingPageContainer';

// Custom asyncLoader function
function asyncLoader(getComponent, message) {
  return class AsyncComponent extends React.Component {
    static Component = null;

    constructor(props) {
      super(props);
      this.state = { Component: AsyncComponent.Component };
    }

    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillMount() {
      if (!this.state.Component) {
        this.componentPromise = getComponent()
          .then(m => (m.default ? m.default : m))
          .then(Component => {
            AsyncComponent.Component = Component;
            this.setState({ Component });
          });
      } else if (!this.componentPromise) {
        this.componentPromise = Promise.resolve();
      }
    }

    render() {
      const { Component } = this.state;
      if (Component) {
        return <Component {...this.props} />;
      }
      return (
        <div className="async-loader">
          <va-loading-indicator message={message || 'Loading page...'} />
        </div>
      );
    }
  };
}

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

const routes = store => (
  <AppConfig>
    <Routes>
      <Route path="/" element={<LandingPageContainer />} />
      <Route
        path="/my-secure-messages/*"
        element={<AsyncSecureMessagingRoutes store={store} />}
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
