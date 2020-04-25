import React, { Component } from 'react';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';

class ViewDependentsCTA extends Component {
  state = {
    isIncludedInFlipper: false,
    loginModalVisible: false,
  };

  closeLoginModal = () => {};

  toggleModal = () => {
    this.props.toggleLoginModal(true);
  };

  render() {
    let content = '';
    if (this.state.isIncludedInFlipper === false) {
      content = (
        <a
          className="usa-button-primary va-button-primary"
          href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=direct-deposit-and-contact-information"
        >
          Go to eBenefits to add or modify a dependent
        </a>
      );
    } else {
      content = (
        <div className="va-sign-in-alert usa-alert usa-alert-continue">
          <div className="usa-alert-body">
            <p className="vads-u-font-family--serif vads-u-font-size--lg usa-alert-heading vads-u-font-weight--bold">
              Please sign in to view dependents added to your VA disability
              benefits
            </p>
            <p className="vads-u-margin-top--1p5">
              Try signing in with your <strong>DS Logon, My HealtheVet,</strong>
              or <strong>ID.me</strong> account. If you don’t have any of those
              accounts, you can create one.
            </p>
            <button
              onClick={this.toggleModal}
              className="usa-button-primary va-button-primary"
            >
              Sign in or create an account
            </button>
          </div>
        </div>
      );
    }
    return <div>{content}</div>;
  }
}

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: update => {
    dispatch(toggleLoginModal(update));
  },
});

const mapStateToProps = store => ({
  user: store.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewDependentsCTA);
