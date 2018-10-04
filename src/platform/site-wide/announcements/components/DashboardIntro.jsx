import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';

export default function DashboardIntro({ dismiss }) {
  return (
    <Modal visible onClose={dismiss} id="modal-announcement">
      <div className="announcement-heading">
        <img alt="profile icon" src="/img/dashboard-announcement.svg" />
      </div>
      <h3 className="announcement-title">
        Welcome to your new personalized homepage
      </h3>
      <p>
        Now, you can see important updates in one place—like the status of your
        prescription refills or disability claims and new secure messages from
        your health care team.
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
