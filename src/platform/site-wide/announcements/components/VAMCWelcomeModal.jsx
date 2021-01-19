import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

export const VAMC_PATHS = {
  PITTSBURGH: /^\/pittsburgh-health-care\/(.)*$/,
};

function VAMCWelcomeModal({ dismiss, announcement }) {
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
        Welcome to the new VA {announcement.region} health care website—built
        with Veterans, for Veterans
      </h3>
      <p>
        You spoke, and we listened. We used feedback from Veterans, family
        members, and caregivers like you. Our new website focuses on helping you
        manage your VA health care journey, including the top tasks we heard
        were most important to you.
      </p>
      <button type="button" onClick={dismiss}>
        Continue to the website
      </button>
    </Modal>
  );
}

VAMCWelcomeModal.propTypes = {
  announcement: PropTypes.shape({
    region: PropTypes.string.isRequired,
  }).isRequired,
};

export default VAMCWelcomeModal;
