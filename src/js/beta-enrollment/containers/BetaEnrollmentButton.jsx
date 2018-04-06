import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerBeta, isUserRegisteredForBeta } from '../actions';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';

class BetaEnrollmentButton extends React.Component {
  static propTypes = {
    feature: PropTypes.string.isRequired,
    returnUrl: PropTypes.string.isRequired
  };

  constructor(props) {
    // Using state instead of props for error handling, because there isn't a place to store errors
    // in the Redux user/profile store, and I chose not to clutter that up with something that is unlikely to be used.
    super(props);
    this.state = { isLoading: false, hasError: false };
  }

  onError = () => {
    this.setState({ isLoading: false, hasError: true });
  }

  onClick = () => {
    this.setState({ isLoading: true });
    this.props.registerBeta(this.props.feature).then(this.onRegistered).catch(this.onError);
  }

  render() {
    if (this.props.isUserRegisteredForBeta(this.props.feature)) document.location.replace(this.props.returnUrl);

    return (
      <RequiredLoginView
        authRequired={1}
        serviceRequired={[]}
        user={this.props.user}>
        <button className="usa-button-primary"
          disabled={this.state.isLoading}
          onClick={this.onClick}>
          {this.state.isLoading && <i className="fa fa-spin fa-spinner"/>} Register for beta access
        </button>
        <AlertBox status="error"
          isVisible={this.state.hasError}
          content={<p>An unknown error occurred while trying to enroll you into the beta.</p>}/>
      </RequiredLoginView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  registerBeta,
  isUserRegisteredForBeta
};

const BetaEnrollmentButtonContainer = connect(mapStateToProps, mapDispatchToProps)(BetaEnrollmentButton);

function createBetaEnrollmentButton(feature, returnUrl) {
  return () => {
    return <BetaEnrollmentButtonContainer feature={feature} returnUrl={returnUrl}/>;
  };
}

export { BetaEnrollmentButton };

export default createBetaEnrollmentButton;
