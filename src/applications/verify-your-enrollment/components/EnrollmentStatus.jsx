import React from 'react';
import PropTypes from 'prop-types';

export const EnrollmentStatus = ({ start, end, total, dontHaveEnrollment }) => {
  const showingEnrollment = `Showing ${start}${
    end > 0 ? ` - ${end}` : ''
  } of ${total} monthly enrollments listed by most recent`;
  return (
    <p
      id="vye-pagination-page-status-text"
      className="focus-element-on-pagination"
      aria-label={showingEnrollment}
      aria-hidden="false"
    >
      {showingEnrollment}

      {dontHaveEnrollment && (
        <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-top--2">
          You currently have no enrollments.
        </span>
      )}
      {total === 0 &&
        !dontHaveEnrollment && (
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-top--2">
            You currently have no enrollments to verify.
          </span>
        )}
    </p>
  );
};

EnrollmentStatus.propTypes = {
  dontHaveEnrollment: PropTypes.bool,
  end: PropTypes.number,
  start: PropTypes.number,
  total: PropTypes.number,
};
