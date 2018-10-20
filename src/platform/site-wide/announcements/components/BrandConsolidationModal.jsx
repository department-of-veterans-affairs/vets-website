import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';

export default function BrandConsolidationModal({ dismiss }) {
  return (
    <Modal
      cssClass="va-modal va-modal-medium"
      visible
      onClose={dismiss}
      id="modal-announcement"
    >
      <div className="announcement-heading">VA + Vets.gov</div>
      <h3 className="announcement-title">Vets.gov is now part of VA.gov</h3>
      <p>You can now find all your Vets.gov tools and information on VA.gov.</p>
      <p>
        With the new VA.gov, we're making it easier for you to access and manage
        your VA benefits and health care services—all in one place. Sign in with
        your My HealtheVet, DS Logon, or ID.me account to track your claims,
        refill your prescriptions, and more.
      </p>
      <button
        type="button"
        aria-label="Dismiss this announcement"
        onClick={dismiss}
      >
        Continue to VA.gov
      </button>
    </Modal>
  );
}
