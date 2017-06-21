import React from 'react';
import { connect } from 'react-redux';
import AcceptTermsPrompt from '../../common/components/AcceptTermsPrompt';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import Modal from '../../common/components/Modal';

import {
  fetchLatestTerms,
  acceptTerms,
} from '../actions';

class AccountManagementSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  acceptAndClose = (arg) => {
    this.props.acceptTerms(arg);
    this.closeModal();
  }

  renderModalContents() {
    const { terms } = this.props;
    const termsAccepted = this.props.profile.healthTermsCurrent;
    if (!termsAccepted && this.state.modalOpen && terms.loading === false && !terms.termsContent) {
      setTimeout(() => {
        this.props.fetchLatestTerms('mhvac');
      }, 100);
      return <LoadingIndicator setFocus message="Loading your information"/>;
    } else if (!termsAccepted && this.state.modalOpen && terms.loading === true) {
      return <LoadingIndicator setFocus message="Loading your information"/>;
    } else if (termsAccepted) {
      return (
        <div>
          <h3>
            You have already accepted the terms and conditions.
          </h3>
          <div>
            <button type="submit" onClick={this.closeModal}>Ok</button>
          </div>
        </div>
      );
    }

    return <AcceptTermsPrompt terms={terms} cancelPath="/profile" onAccept={this.acceptAndClose}/>;
  }

  render() {
    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Account Management</h4>
        <p><a onClick={this.openModal}>Terms and Conditions for Health Tools</a></p>
        <div className="button-container medium-12 columns">
          <a href="https://wallet.id.me/settings" target="_blank" className="warn-exit usa-button-primary usa-button-outline usa-button-outline-exit transparent">
            Delete Your Account
          </a>
        </div>
        <Modal
            cssClass="va-modal-large"
            contents={this.renderModalContents()}
            id="mhvac-modal"
            visible={this.state.modalOpen}
            onClose={() => this.closeModal()}/>
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetchLatestTerms,
  acceptTerms,
};

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    terms: userState.profile.terms,
    profile: userState.profile
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSection);
export { AccountManagementSection };
