import React from 'react';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

export default function PrintLink({ appointment }) {
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;

  if (canceled) {
    return null;
  }

  return (
    <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
      <i
        aria-hidden="true"
        className="fas fa-print vads-u-margin-right--1 vads-u-color--link-default"
      />
      <button className="va-button-link" onClick={() => window.print()}>
        Print
      </button>
    </div>
  );
}
