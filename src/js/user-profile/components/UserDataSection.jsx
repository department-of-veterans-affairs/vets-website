import React from 'react';
import { connect } from 'react-redux';
import AcceptTermsPrompt from '../../common/components/AcceptTermsPrompt';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import Modal from '../../common/components/Modal';
import _ from 'lodash';

import moment from 'moment';

import {
  fetchLatestTerms,
  acceptTerms,
} from '../actions';

class UserDataSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  openModal = () => {
    window.dataLayer.push({ event: 'terms-shown-profile' });
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

  renderTermsLink() {
    if (this.props.profile.healthTermsCurrent) {
      return (
        <p>You have accepted the latest health terms and conditions for this site.</p>
      );
    }
    return (
      <p><a onClick={this.openModal}>Terms and Conditions for Health Tools</a></p>
    );
  }

  render() {
    const {
      profile: {
        accountType,
        dob,
        email,
        gender
      },
      name: {
        first: firstName,
        middle: middleName,
        last: lastName
      }
    } = this.props;

    let content;
    const name = `${firstName || ''} ${middleName || ''} ${lastName || ''}`;

    if (accountType === 3) {
      content = (
        <span>
          <p><span className="label">Name:</span>{_.startCase(_.toLower(name))}</p>
          <p><span className="label">Birth sex:</span>{`${gender === 'F' ? 'Female' : 'Male'}`}</p>
          <p><span className="label">Date of birth:</span>{moment(`${dob}`).format('MMM D, YYYY')}</p>
        </span>
      );
    }

    return (
      <div className="profile-section">
        <h4 className="section-header">Account information</h4>
        <div className="info-container">
          {content}
          <p><span className="label">Email address:</span> {email}</p>
          <p><a href="https://wallet.id.me/settings" target="_blank">Manage your account</a></p>
          {this.renderTermsLink()}
        </div>
        <Modal
            cssClass="va-modal-large"
            contents={this.renderModalContents()}
            id="mhvac-modal"
            visible={this.state.modalOpen}
            onClose={this.closeModal}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    name: userState.profile.userFullName,
    profile: userState.profile,
    terms: userState.profile.terms
  };
};

const mapDispatchToProps = {
  fetchLatestTerms,
  acceptTerms,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDataSection);
export { UserDataSection };
