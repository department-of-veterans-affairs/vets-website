import React from 'react';

export default function AppointmentInstructions({ instructions }) {
  if (!instructions) {
    return null;
  }

  return (
    <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
      <h4 className="vaos-appts__block-label">Special instructions</h4>
      <div>{instructions}</div>
    </div>
  );
}
