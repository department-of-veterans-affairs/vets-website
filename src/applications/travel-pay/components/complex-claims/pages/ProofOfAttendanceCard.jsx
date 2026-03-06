import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { PROOF_OF_ATTENDANCE_FILENAME } from '../../../constants';

const ProofOfAttendanceCard = ({
  filename,
  decreaseHeaderLevel = false,
  showEdit = true,
}) => {
  return (
    <div className="vads-u-margin-top--2">
      <va-card className="expense-card" data-testid="proof-of-attendance-card">
        {decreaseHeaderLevel ? (
          <h4 className="vads-u-margin-top--1">File name</h4>
        ) : (
          <h3 className="vads-u-margin-top--1">File name</h3>
        )}
        <p>{filename}</p>
        <p>
          <span className="vads-u-font-weight--bold">Note:</span>
          {` We’ve changed your file name to "${PROOF_OF_ATTENDANCE_FILENAME}."`}
        </p>
        <div className="review-button-row">
          {showEdit && (
            <div className="review-edit-button">
              <Link
                data-testid="proof-of-attendance-edit-link"
                to="/" // TODO: Go to proof of attendance edit page
              >
                Edit
                <va-icon
                  active
                  icon="navigate_next"
                  size={3}
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}
        </div>
      </va-card>
    </div>
  );
};

ProofOfAttendanceCard.propTypes = {
  filename: PropTypes.string.isRequired,
  decreaseHeaderLevel: PropTypes.bool,
  showEdit: PropTypes.bool,
};

export default ProofOfAttendanceCard;
