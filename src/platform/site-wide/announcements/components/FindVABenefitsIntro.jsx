import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

export default function FindVABenefitsIntro({ dismiss }) {
  return (
    <Modal visible onClose={dismiss} id="modal-announcement">
      <div className="announcement-heading">
        <img aria-hidden="true" alt="" src="/img/dashboard-form.svg" />
      </div>
      <h3 className="announcement-title" id="modal-announcement-title">
        We can help you find and apply for benefits.
      </h3>
      <p>
        Our new “Find VA benefits” tool can help you quickly learn which
        benefits you may be eligible for, and how to apply. Get started by
        clicking on the “Find VA benefits now” button below.
      </p>
      <a onClick={dismiss} className="usa-button" href="find-benefits/">
        Find VA benefits now
      </a>
      <button
        type="button"
        className="usa-button-secondary"
        aria-label="No thanks"
        onClick={dismiss}
      >
        No, thanks
      </button>
    </Modal>
  );
}
