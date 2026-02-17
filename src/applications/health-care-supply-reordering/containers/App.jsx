import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
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
        sessionSampleRate: 50,
        sessionReplaySampleRate: 50,
        trackInteractions: true,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask',
      });
      datadogRum.startSessionReplayRecording();
    }

    const { location, children, isError, pending, featureToggles } = this.props;
    const showMainContent = !pending && !isError && !featureToggles.loading;
    const isMhvSupplyReorderingEnabled =
      featureToggles[FEATURE_FLAG_NAMES.mhvSupplyReorderingEnabled];

    // Redirect to mhv app and render nothing if feature toggle is enabled.
    if (isMhvSupplyReorderingEnabled && !featureToggles.loading) {
      window.location.replace('/my-health/order-medical-supplies');
      return null;
    }

    const breadcrumbLinks = [
      { href: '/', label: 'Home' },
      { href: '/health-care', label: 'VA health care' },
      {
        href: '/health-care/order-hearing-aid-or-cpap-supplies-form',
        label: `Order hearing aid or CPAP supplies`,
      },
    ];
    const bcString = JSON.stringify(breadcrumbLinks);

    return (
      <>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns print-full-width">
            <VaBreadcrumbs
              breadcrumb-list={bcString}
              class="va-nav-breadcrumbs vads-u-padding--0"
            />
          </div>
        </div>
        {(pending || featureToggles.loading) && (
          <va-loading-indicator>
            Loading your information...
          </va-loading-indicator>
        )}
        {isError &&
          !pending && (
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

App.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
  featureToggles: PropTypes.object,
  fetchFormStatus: PropTypes.func,
  isError: PropTypes.bool,
  pending: PropTypes.bool,
};

const mapStateToProps = state => ({
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
