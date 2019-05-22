import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export default class WelcomeToNewVAModal extends React.Component {
  render() {
    const { dismiss } = this.props;

    return (
      <Modal
        cssClass="va-modal announcement-brand-consolidation"
        visible
        onClose={dismiss}
        id="modal-announcement"
      >
        <div className="announcement-heading-brand-consolidation">
          <img
            className="announcement-brand-consolidation-logo"
            src="/img/design/logo/va-logo.png"
            alt="VA.gov"
          />
        </div>
        <h3 id="modal-announcement-title" className="announcement-title">
          Welcome to the New VA.gov — Built with Veterans, for Veterans
        </h3>
        <p>
          Our new site offers one place to access all VA benefits and health
          care services. You can sign in with your My HealtheVet, DS Logon, or
          ID.me account to track your claims, refill your prescriptions, and
          more.
        </p>
        <button type="button" onClick={dismiss}>
          Continue to the new VA.gov
        </button>
      </Modal>
    );
  }
}
