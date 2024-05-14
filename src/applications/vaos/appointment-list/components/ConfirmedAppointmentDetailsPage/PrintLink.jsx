import React from 'react';
import PropTypes from 'prop-types';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

export default function PrintLink({ appointment }) {
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;

  if (canceled) {
    return null;
  }

  return (
    <div className="vads-u-margin-top--2 vaos-hide-for-print">
      <button
        className="va-button-link"
        type="button"
        onClick={() => window.print()}
      >
        <span className="vads-u-margin-right--0p5">
          <va-icon icon="print" size="3" aria-hidden="true" />
        </span>
        Print
      </button>
    </div>
  );
}

PrintLink.propTypes = {
  appointment: PropTypes.shape({
    status: PropTypes.string.isRequired,
  }),
};
PrintLink.defaultProps = {
  appointment: {
    status: 'booked',
  },
};
