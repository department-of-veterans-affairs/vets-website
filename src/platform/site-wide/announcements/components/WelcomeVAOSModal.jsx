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
      <h1 className="vads-u-font-size--h3 vads-u-margin-top--2">
        Welcome to the new VA.gov online scheduling tool
      </h1>
      <p>
        The VA appointments tool has been redesigned based on feedback from
        Veterans like you. You can now view, schedule, and cancel all your
        appointments in one place on VA.gov.
      </p>
      <p>
        If you want to go back to the old appointments tool, you’ll find a link
        to that scheduling tool at the bottom of the page in the new tool.
      </p>
      <button type="button" onClick={dismiss}>
        Continue to your VA appointments
      </button>
    </Modal>
  );
}
