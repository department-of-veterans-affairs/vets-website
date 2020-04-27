import React, { Component } from 'react';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';

import FlipperContent from '../components/FlipperContent.jsx';

class ViewDependentsCTA extends Component {
  state = {
    isIncludedInFlipper: true,
    loginModalVisible: false,
  };

  closeLoginModal = () => {};

  toggleModal = () => {
    this.props.toggleLoginModal(true);
  };

  render() {
    let content;
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
        <FlipperContent
          toggleModal={this.toggleModal}
          loggedIn={this.props.user.login.currentlyLoggedIn}
        />
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
