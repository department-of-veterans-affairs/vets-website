import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';

export default function RecommendationsIntro({ dismiss }) {
  return (
    <Modal visible onClose={dismiss} id="modal-announcement">
      <div className="announcement-heading">
        <img alt="form icon" src="/img/dashboard-form.svg" />
      </div>
      <h3 className="announcement-title">
        We can help you find and apply for benefits.
      </h3>
      <p>
        Our new Find VA Benefits tool will help you discover VA benefits and
        provide you with detailed directions on how to apply for them. Get
        started by clicking the Find VA Benefits Now button below.
      </p>
      <a className="usa-button" href="preferences/">
        Find VA Benefits Now
      </a>
      <button
        type="button"
        className="usa-button-secondary"
        aria-label="No thanks"
        onClick={dismiss}
      >
        No Thanks
      </button>
    </Modal>
  );
}
