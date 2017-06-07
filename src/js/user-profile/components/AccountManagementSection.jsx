import React from 'react';
import { connect } from 'react-redux';
import AcceptTermsPrompt from '../../common/components/AcceptTermsPrompt';
import Modal from '../../common/components/Modal';

import {
  checkAcceptance,
  fetchLatestTerms,
  acceptTerms,
} from '../actions';

class AccountManagementSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  componentDidMount() {
    this.props.checkAcceptance('mhvac');
    this.props.fetchLatestTerms('mhvac');
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  renderModalContents() {
    const { terms } = this.props.profile;
    // terms.terms is not a typo
    if (terms.acceptance) {
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
    return <AcceptTermsPrompt terms={terms.terms} onAccept={this.props.acceptTerms}/>;
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
  checkAcceptance,
  fetchLatestTerms,
  acceptTerms,
};

// TODO: fill this out
const mapStateToProps = (state) => {
  const userState = state.user;
  return userState;
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSection);
export { AccountManagementSection };
