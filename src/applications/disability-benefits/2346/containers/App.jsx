import React, { Component } from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchFormStatus } from '../actions';
import formConfig from '../config/form';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

class App extends Component {
  componentDidMount() {
    this.props.fetchFormStatus();
  }

  render() {
    const { location, children, isError, pending, isLoggedIn } = this.props;
    const showMainContent = !pending && !isError;

    return (
      <>
        <Breadcrumbs>
          <a href="/">Home</a>
          {/* this will get updated when this route is added */}
          <a href="/health-care">Health care</a>
          <a href="/health-care/order-hearing-aid-batteries-and-accessories">
            Order hearing aid batteries and accessories
          </a>
          <span className="vads-u-color--black">
            <strong>Order form 2346</strong>
          </span>
        </Breadcrumbs>
        {pending && (
          <LoadingIndicator setFocus message="Loading your information..." />
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
