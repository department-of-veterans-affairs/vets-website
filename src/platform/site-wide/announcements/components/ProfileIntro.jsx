import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import siteName from '../../../brand-consolidation/site-name';

export default function ProfileIntro({ dismiss, profile }) {
  if (profile.loading) return <div />;
  if (profile.loa.current !== 3) return <div />;

  return (
    <Modal visible onClose={dismiss} id="modal-announcement">
      <div className="announcement-heading">
        <img alt="profile icon" src="/img/profile-announcement.svg" />
      </div>
      <h3 className="announcement-title">
        Welcome to your new {siteName} profile
      </h3>
      <p>
        Review your contact, personal, and military service information—and find
        out how to update it as needed.
      </p>
      <button
        type="button"
        aria-label="Dismiss this announcement"
        onClick={dismiss}
      >
        Continue
      </button>
    </Modal>
  );
}
