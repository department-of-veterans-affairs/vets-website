import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/jean-pants/LoadingIndicator';
import Modal from '@department-of-veterans-affairs/jean-pants/Modal';
import recordEvent from '../../../platform/monitoring/record-event';
import { mfa } from '../../../platform/utilities/authentication';
import AcceptTermsPrompt from '../../common/components/AcceptTermsPrompt';
import { fetchLatestTerms, acceptTerms } from '../actions';
import PersonalizationBetaInvite from './PersonalizationBetaInvite';

class UserDataSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  openModal = () => {
    recordEvent({ event: 'terms-shown-profile' });
    this.setState({ modalOpen: true }, () => {
      if (!this.props.terms.termsContent) {
        this.props.fetchLatestTerms('mhvac');
      }
    });
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  acceptAndClose = (arg) => {
    this.props.acceptTerms(arg);
    this.closeModal();
  }

  renderModalContents = () => {
    const { terms } = this.props;
    const termsAccepted = this.props.profile.healthTermsCurrent;

    if (!this.state.modalOpen) { return null; }

    if (terms.loading) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    }

    if (termsAccepted) {
      return (
        <div>
          <h3>You have already accepted the terms and conditions.</h3>
          <div><button type="submit" onClick={this.closeModal}>Ok</button></div>
        </div>
      );
    }

    return <AcceptTermsPrompt terms={terms} cancelPath="/profile" onAccept={this.acceptAndClose} isInModal/>;
  }

  renderTermsLink = () => {
    if (this.props.profile.healthTermsCurrent) {
      return (
        <p>You have accepted the latest health terms and conditions for this site.</p>
      );
    }
    return (
      <p><a onClick={this.openModal}>Terms and Conditions for Health Tools</a></p>
    );
  }

  renderMultifactorMessage = () => {
    if (this.props.profile.multifactor) { return null; }

    const headline = 'Add extra security to your account';
    const content = (
      <div>
        <p>For additional protection, we encourage you to add a second security step for signing in to your account.</p>
        <button className="usa-button usa-button-secondary" onClick={mfa}>Add security step</button>
      </div>
    );

    return (
      <p>
        <AlertBox
          headline={headline}
          content={content}
          isVisible
          status="warning"/>
      </p>
    );
  }

  render() {
    const {
      profile: {
        dob,
        email,
        gender,
        verified
      },
      name: {
        first: firstName,
        middle: middleName,
        last: lastName
      }
    } = this.props;

    let content;
    const name = `${firstName || ''} ${middleName || ''} ${lastName || ''}`;

    if (verified) {
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
          {this.renderMultifactorMessage()}
          {!verified && <p><span className="label"><a href="/verify?next=/profile">Verify your identity</a> to access more services you may be eligible for.</span></p>}
          <p>Want to change your email, password, or other account settings?<br/>
            <a href="https://wallet.id.me/settings" target="_blank">Go to ID.me to manage your account</a>
          </p>
          {this.renderTermsLink()}
          <PersonalizationBetaInvite profile={this.props.profile}/>
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
    login: userState.login,
    name: userState.profile.userFullName,
    profile: userState.profile,
    terms: userState.profile.mhv.terms
  };
};

const mapDispatchToProps = {
  fetchLatestTerms,
  acceptTerms
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDataSection);
export { UserDataSection };
