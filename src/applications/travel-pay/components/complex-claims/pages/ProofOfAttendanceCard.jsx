import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { PROOF_OF_ATTENDANCE_FILENAME } from '../../../constants';

const ProofOfAttendanceCard = ({ filename }) => {
  return (
    <va-accordion-item
      key="proof-of-attendance"
      header="Proof of attendance"
      level={2}
    >
      <div className="vads-u-margin-top--2">
        <va-card
          className="expense-card"
          data-testid="proof-of-attendance-card"
        >
          <h3 className="vads-u-margin-top--1">File name</h3>
          <p>{filename}</p>
          <p>
            <span className="vads-u-font-weight--bold">Note:</span> We’ve
            changed your file name to "{PROOF_OF_ATTENDANCE_FILENAME}
            ."
          </p>
          <div className="review-button-row">
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
          </div>
        </va-card>
      </div>
    </va-accordion-item>
  );
};

ProofOfAttendanceCard.propTypes = {
  filename: PropTypes.string.isRequired,
};

export default ProofOfAttendanceCard;
