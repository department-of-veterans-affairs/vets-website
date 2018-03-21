import React from 'react';
import { connect } from 'react-redux';
import AcceptTermsPrompt from '../../../common/components/AcceptTermsPrompt';
import LoadingIndicator from '../../../common/components/LoadingIndicator';
import Modal from '../../../common/components/Modal';
import AlertBox from '../../../common/components/AlertBox';

import { getMultifactorUrl, handleMultifactor } from '../../../common/helpers/login-helpers';
import { updateMultifactorUrl } from '../../../login/actions';

import {
  fetchLatestTerms,
  acceptTerms,
} from '../actions';

function MultifactorMessage({ multifactor, handleMultifactorRequest }) {
  const headline = 'Add extra security to your account';
  const content = (
    <div>
      <p>For additional protection, we encourage you to add a second security step for signing in to your account.</p>
      <button className="usa-button usa-button-secondary" onClick={handleMultifactorRequest}>Add security step</button>
    </div>
  );

  return (
    <AlertBox
      headline={headline}
      content={content}
      isVisible={!multifactor}
      status="info"/>
  );
}

function AccountVerification({ accountType }) {
  let content = null;

  if (accountType !== 3) {
    content = (
      <div>
        <p>Verify your identity to access more services your may be eligible for.<br/>
          <a className="usa-button-primary" href="/verify?next=/profile">Verify identity</a>
        </p>
      </div>
    );
  } else {
    content = <p><i className="fa fa-check-circle"/> Your account has been verified.</p>;
  }

  return (
    <div>
      <h4>Account verification</h4>
      {content}
    </div>
  );
}

function LoginSettings() {
  return (
    <div>
      <h4>Login Settings</h4>
      <p>Want to change your email, password, or other account settings?<br/>
        <a href="https://wallet.id.me/settings" target="_blank">Go to ID.me to manage your account</a>
      </p>
    </div>
  );
}

function TermsAndConditions({ healthTermsCurrent, openModal }) {
  let content = null;

  if (healthTermsCurrent) {
    content = (
      <p>You have accepted the latest health terms and conditions for this site.</p>
    );
  } else {
    content = (
      <p>In order to refill your prescriptions, message your health care team, and get your VA health records, you need to accept the <a onClick={openModal}>Terms and Conditions for Health Tools</a>.</p>
    );
  }

  return (
    <div>
      <h4>Terms and conditions</h4>
      {content}
    </div>
  );
}

class UserDataSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
    this.getMultifactorUrl();
  }

  componentWillUnmount() {
    this.multifactorUrlRequest.abort();
  }

  getMultifactorUrl() {
    this.multifactorUrlRequest = getMultifactorUrl(this.props.updateMultifactorUrl);
  }

  handleMultifactorRequest = () => {
    handleMultifactor(this.props.login.multifactorUrl);
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
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    } else if (!termsAccepted && this.state.modalOpen && terms.loading === true) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
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

    return <AcceptTermsPrompt terms={terms} cancelPath="/profile" onAccept={this.acceptAndClose} isInModal/>;
  }

  render() {
    const {
      profile: {
        accountType,
        multifactor,
        healthTermsCurrent
      }
    } = this.props;

    return (
      <div className="profile-section">
        <div className="info-container">
          <MultifactorMessage multifactor={multifactor} handleMultifactorRequest={this.handleMultifactorRequest}/>
          <AccountVerification accountType={accountType}/>
          <LoginSettings/>
          <TermsAndConditions healthTermsCurrent={healthTermsCurrent} openModal={this.openModal}/>
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
    terms: userState.profile.terms
  };
};

const mapDispatchToProps = {
  fetchLatestTerms,
  acceptTerms,
  updateMultifactorUrl,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDataSection);
export { UserDataSection };
