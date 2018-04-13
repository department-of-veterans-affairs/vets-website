import React from 'react';
import recordEvent from '../../../../platform/monitoring/record-event';
import AcceptTermsPrompt from '../../../common/components/AcceptTermsPrompt';
import LoadingIndicator from '../../../common/components/LoadingIndicator';
import Modal from '../../../common/components/Modal';

import AccountVerification from './AccountVerification';
import LoginSettings from './LoginSettings';
import MultifactorMessage from './MultifactorMessage';
import TermsAndConditions from './TermsAndConditions';

class UserDataSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  openModal = () => {
    recordEvent({ event: 'terms-shown-profile' });
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
        loa,
        multifactor,
        healthTermsCurrent
      }
    } = this.props;

    return (
      <div>
        <AccountVerification loa={loa}/>
        <MultifactorMessage multifactor={multifactor}/>
        <LoginSettings/>
        <TermsAndConditions healthTermsCurrent={healthTermsCurrent} openModal={this.openModal}/>
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

export default UserDataSection;
