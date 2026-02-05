import React from 'react';

const EmptyPrescriptionContent = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2 vads-u-padding-x--3 vads-u-border-color">
    <h2 className="vads-u-margin--0" data-testid="empty-medList-alert">
      You don’t have any VA prescriptions or medication records
    </h2>
    <p className="vads-u-margin-y--3">
      If you need a prescription or you want to tell us about a medication
      you’re taking, tell your care team at your next appointment.
    </p>
  </div>
);

export default EmptyPrescriptionContent;
