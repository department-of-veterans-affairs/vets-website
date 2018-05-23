import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';

export default function DashboardIntro({ dismiss }) {
  return (
    <Modal
      visible
      onClose={dismiss}
      id="dashboard-announcement">
      <h1>Check out the dashboard</h1>
    </Modal>
  );
}
