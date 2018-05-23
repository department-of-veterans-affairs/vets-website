import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';

export default function DashboardIntro({ dismiss }) {
  return (
    <Modal
      visible
      onClose={dismissAnnouncement}
      id="dashboard-announcement">
      <h1>Check out the profile</h1>
    </Modal>
  );
}
