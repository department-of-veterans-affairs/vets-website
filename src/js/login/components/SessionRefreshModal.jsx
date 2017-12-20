import React from 'react';
import moment from 'moment';
import Modal from '../../common/components/Modal';

class SessionRefreshModal extends React.Component {

  componentDidMount() {
    this.interval = window.setInterval(this.checkTokenExpiration, this.props.sessionExpirationIntervalSeconds * 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  checkTokenExpiration = () => {
    if (this.props.profile.loading ||
      !this.props.login.currentlyLoggedIn ||
      this.props.login.showSessionRefreshModal) return;

    const now = moment();
    const entryTime = sessionStorage.entryTime;
    const expiresSoon = now.isAfter(moment(entryTime).add(this.props.sessionExpiresAfterMinutes - 10, 'm'));
    if (!expiresSoon) return;

    this.props.updateSessionExpiresSoon(true);
  }

  render() {
    const { sessionExpiresAfterMinutes, visible, handleLogin, handleLogout } = this.props;
    const now = moment();
    const isExpired =  now.isAfter(moment(window.sessionStorage.entryTime).add(sessionExpiresAfterMinutes, 'm'));
    let title = null;
    let content = null;

    if (isExpired) {
      title = 'Your Vets.gov session has expired';
      content = (
        <div>
          <p>To protect your privacy and security, your session has expired after an hour of inactivity.</p>
          <button type="button" className="usa-button-primary" onClick={() => document.location.reload()}>Return to Vets.gov</button>
        </div>
      );
    } else {
      title = 'Your Vets.gov session is expiring';
      content = (
        <div>
          <p>To protect your privacy and security, your session is expiring and you will be automatically signed out within 10 minutes. Would you like to stay signed in?</p>
          <button type="button"
            className="usa-button-primary"
            onClick={(event) => {
              event.preventDefault();
              return handleLogin();
            }}>Stay signed in</button>
          <button type="button"
            className="usa-button-secondary"
            onClick={(event) => {
              event.preventDefault();
              return handleLogout();
            }}>Sign out now</button>
        </div>
      );
    }

    return (
      <div>
        <Modal
          id="session-refresh-modal"
          hideCloseButton
          onClose={() => {}}
          visible={visible}
          focusSelector="button"
          title={title}>
          {content}
        </Modal>
      </div>
    );
  }

}

export default SessionRefreshModal;
