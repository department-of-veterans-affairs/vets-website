import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';

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
        Our new “Find VA Benefits” tool can help you quickly learn which
        benefits you may be eligible for, and how to apply. Get started by
        clicking on the “Find VA Benefits Now” button below.
      </p>
      <a onClick={dismiss} className="usa-button" href="find-benefits/">
        Find VA Benefits Now
      </a>
      <button
        type="button"
        className="usa-button-secondary"
        aria-label="No thanks"
        onClick={dismiss}
      >
        No, Thanks
      </button>
    </Modal>
  );
}
