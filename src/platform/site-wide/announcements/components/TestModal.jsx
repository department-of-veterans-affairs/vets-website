import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

export default function TestModal(props) {
  const { dismiss } = props;

  return (
    <Modal
      cssClass="va-modal announcement-brand-consolidation"
      visible
      onClose={dismiss}
      id="modal-announcement"
    >
      <div className="announcement-heading-brand-consolidation">
        This is the test modal
      </div>
      <button type="button" onClick={dismiss}>
        Continue to VA.gov
      </button>
    </Modal>
  );
}
