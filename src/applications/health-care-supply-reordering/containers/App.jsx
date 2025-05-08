import React, { Component } from 'react';
import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { datadogRum } from '@datadog/browser-rum';
import { fetchFormStatus } from '../actions';
import formConfig from '../config/form';
import ErrorMessage from '../components/ErrorMessage';

class App extends Component {
  componentDidMount() {
    this.props.fetchFormStatus();
  }

  render() {
    if (
      // Prevent RUM from running on local/CI environments.
      environment.BASE_URL.indexOf('localhost') < 0 &&
      // Prevent re-initializing the SDK.
      !window.DD_RUM?.getInitConfiguration() &&
      !window.Mocha
    ) {
      datadogRum.init({
        applicationId: 'a0a53db3-74e7-4741-bd3f-35568fb66e8e',
        clientToken: 'pubf630a1a21f35ff1cc9bf698739bcd3bc',
        site: 'ddog-gov.com',
        service: 'medical-supply-reordering',
        env: environment.vspEnvironment(),
        sessionSampleRate: 100,
        sessionReplaySampleRate: 100,
        trackInteractions: true,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask',
      });
      datadogRum.startSessionReplayRecording();
    }

    const { location, children, isError, pending, isLoggedIn } = this.props;
    const showMainContent = !pending && !isError;

    const breadcrumbLinks = [
      { href: '/', label: 'Home' },
      { href: '/health-care', label: 'VA health care' },
      {
        href: '/health-care/order-hearing-aid-or-cpap-supplies-form',
        label: `Order hearing aid or CPAP supplies`,
      },
    ];

    return (
      <>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns print-full-width">
            <VaBreadcrumbs
              breadcrumb-list={breadcrumbLinks}
              class="va-nav-breadcrumbs vads-u-padding--0"
            />
          </div>
        </div>
        {pending && (
          <va-loading-indicator>
            Loading your information...
          </va-loading-indicator>
        )}
        {isError &&
          !pending &&
          isLoggedIn && (
            <div className="row vads-u-margin-bottom--3">
              <ErrorMessage />
            </div>
          )}
        {showMainContent && (
          <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
            {children}
          </RoutedSavableApp>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isError: state.mdot.isError,
  pending: state.mdot.pending,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ fetchFormStatus }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
