import React from 'react';
import PropTypes from 'prop-types';

export default function CCInstructions({ appointment }) {
  const showInstructions = !!appointment.comment;

  if (!showInstructions) {
    return null;
  }

  return (
    <div className="vads-u-margin-top--3 vaos-appts__block-label">
      <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
          Special instructions
        </h2>
        <div>{appointment.comment}</div>
      </div>
    </div>
  );
}

CCInstructions.propTypes = {
  appointment: PropTypes.shape({
    comment: PropTypes.string,
  }),
};

CCInstructions.defaultProps = {
  appointment: {
    comment: '',
  },
};
