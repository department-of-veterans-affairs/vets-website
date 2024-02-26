import React, { Component } from 'react';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
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

    const {
      location,
      children,
      isError,
      pending,
      isLoggedIn,
      featureToggles,
    } = this.props;
    const showMainContent = !pending && !isError && !featureToggles.loading;
    const supplyDescription = featureToggles.supply_reordering_sleep_apnea_enabled
      ? 'hearing aid or CPAP supplies'
      : 'hearing aid batteries and accessories';

    // Update form config on the fly based on feature toggle.
    formConfig.title = `Order ${supplyDescription}`;
    formConfig.saveInProgress.messages.inProgress = `You have a ${supplyDescription} order s in progress.`;
    formConfig.saveInProgress.messages = {
      inProgress: `You have a ${supplyDescription}} order in progress.`,
      expired: `Your saved ${supplyDescription} order has expired. If you want to order ${supplyDescription}, please start a new order.`,
      saved: `Your ${supplyDescription} order has been saved.`,
    };
    // eslint-disable-next-line react/prop-types
    const isPageNotFound = children.type && children.type === PageNotFound;

    return (
      <>
        {!featureToggles.loading &&
          !isPageNotFound && (
            <va-breadcrumbs class="va-nav-breadcrumbs">
              <a href="/">Home</a>
              {/* this will get updated when this route is added */}
              <a href="/health-care">Health care</a>
              <a href="/health-care/order-hearing-aid-batteries-and-accessories">
                Order {supplyDescription}
              </a>
            </va-breadcrumbs>
          )}
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
  featureToggles: state.featureToggles,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ fetchFormStatus }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
