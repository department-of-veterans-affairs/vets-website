import React from 'react';
import PropTypes from 'prop-types';
import { PURPOSE_TEXT_V2 } from '../../../utils/constants';

export default function VAInstructions({ appointment }) {
  const showInstructions =
    appointment.version === 2
      ? appointment?.comment
      : PURPOSE_TEXT_V2.some(purpose =>
          appointment?.comment?.startsWith(purpose.short),
        );

  if (!showInstructions) {
    return null;
  }

  return (
    <div className="vads-u-margin-top--3 vaos-appts__block-label">
      <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
          You shared these details about your concern
        </h2>
        <div>{appointment.comment}</div>
      </div>
    </div>
  );
}

VAInstructions.propTypes = {
  appointment: PropTypes.shape({
    comment: PropTypes.string,
    version: PropTypes.number,
  }),
};

VAInstructions.defaultProps = {
  appointment: {
    comment: '',
    version: 2,
  },
};
