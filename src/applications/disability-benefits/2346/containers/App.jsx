import React, { Component } from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchFormStatus } from '../actions';
import formConfig from '../config/form';
import ErrorMessage from '../components/ErrorMessage';

class App extends Component {
  componentDidMount() {
    this.props.fetchFormStatus();
  }

  render() {
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
      ? 'hearing aid and CPAP supplies'
      : 'hearing aid batteries and accessories';

    // Update form config on the fly based on feature toggle.
    formConfig.title = `Order ${supplyDescription}`;
    formConfig.saveInProgress.messages.inProgress = `You have a ${supplyDescription} order s in progress.`;
    formConfig.saveInProgress.messages = {
      inProgress: `You have a ${supplyDescription}} order in progress.`,
      expired: `Your saved ${supplyDescription} order has expired. If you want to order ${supplyDescription}, please start a new order.`,
      saved: `Your ${supplyDescription} order has been saved.`,
    };

    return (
      <>
        {!featureToggles.loading && (
          <Breadcrumbs>
            <a href="/">Home</a>
            {/* this will get updated when this route is added */}
            <a href="/health-care">Health care</a>
            <a href="/health-care/order-hearing-aid-batteries-and-accessories">
              Order {supplyDescription}
            </a>
          </Breadcrumbs>
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
