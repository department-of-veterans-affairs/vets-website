import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export default function WelcomeVAOSModal({ dismiss }) {
  return (
    <Modal visible onClose={dismiss} id="modal-announcement">
      <div className="announcement-heading-brand-consolidation">
        <img
          className="announcement-brand-consolidation-logo"
          src="/img/design/logo/va-logo.png"
          alt="VA.gov"
        />
      </div>
      <h1
        id="modal-announcement-title"
        className="vads-u-font-size--h3 announcement-title"
      >
        Welcome to the new VA online scheduling tool on VA.gov
      </h1>
      <p>
        This tool has been redesigned with Veteran feedback. You may use this
        tool to schedule, request, and cancel some VA or community care
        appointments.
      </p>
      <p>
        If you need it, you will find a link to the mobile online scheduling
        tool in the footer.
      </p>
      <button type="button" onClick={dismiss}>
        Continue to the new VA online scheduling tool
      </button>
    </Modal>
  );
}
