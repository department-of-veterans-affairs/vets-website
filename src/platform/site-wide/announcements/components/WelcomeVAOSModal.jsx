import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

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
        Welcome to the new VA online scheduling tool
      </h1>
      <p>
        Things may look a little different than the last time you scheduled a
        health appointment online. Based on feedback from Veterans like you,
        we’ve redesigned the VA online scheduling tool. You can now schedule,
        cancel, and view your future and past appointments all in one place.
      </p>
      <p>
        If you like to send us feedback about the new experience, you’ll find a
        feedback link at the bottom of the page in the tool.
      </p>
      <button type="button" onClick={dismiss}>
        Go to your VA appointments
      </button>
    </Modal>
  );
}
