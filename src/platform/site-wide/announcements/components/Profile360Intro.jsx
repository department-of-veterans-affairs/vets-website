import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';

export default function ProfileIntro({ dismiss, profile }) {
  if (profile.loading) return <div />;
  if (profile.loa.current !== 3) return <div />;

  return (
    <Modal visible onClose={dismiss} id="modal-announcement">
      <div className="announcement-heading">
        <img alt="profile icon" src="/img/profile-announcement.svg" />
      </div>
      <h3 className="announcement-title">
        Changes to your contact information will now update in more places
      </h3>
      <p>
        When you change the contact information in your profile, it will now
        update your information across more VA benefits and services, including
        disability compensation, pension benefits, claims and appeals, and the
        VA health care program.
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
