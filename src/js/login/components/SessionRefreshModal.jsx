import React from 'react';
import moment from 'moment';
import Modal from '../../common/components/Modal';

function SessionRefreshModal({ sessionExpiresAfterMinutes, visible, login, logout }) {
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
            return login();
          }}>Stay signed in</button>
        <button type="button"
          className="usa-button-secondary"
          onClick={(event) => {
            event.preventDefault();
            return logout();
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

export default SessionRefreshModal;
