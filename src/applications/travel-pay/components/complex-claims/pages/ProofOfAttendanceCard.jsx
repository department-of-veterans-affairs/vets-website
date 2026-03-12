import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

const ProofOfAttendanceCard = ({
  apptId,
  claimId,
  filename,
  decreaseHeaderLevel = false,
  showEdit = true,
}) => {
  const HeadingTag = decreaseHeaderLevel ? 'h4' : 'h3';
  const filenameWithoutExtension = filename?.replace(/\.[^.]+$/, '');

  return (
    <div className="vads-u-margin-top--2">
      <va-card className="expense-card" data-testid="proof-of-attendance-card">
        <HeadingTag className="vads-u-margin-top--1">File name</HeadingTag>
        <p>{filename}</p>
        <p>
          <span className="vads-u-font-weight--bold">Note:</span>
          {` We’ve changed your file name to "${filenameWithoutExtension}."`}
        </p>
        <div className="review-button-row">
          {showEdit && (
            <div className="review-edit-button">
              <Link
                data-testid="proof-of-attendance-edit-link"
                to={`/file-new-claim/${apptId}/${claimId}/proof-of-attendance`}
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
  apptId: PropTypes.string,
  claimId: PropTypes.string,
  decreaseHeaderLevel: PropTypes.bool,
  showEdit: PropTypes.bool,
};

export default ProofOfAttendanceCard;
